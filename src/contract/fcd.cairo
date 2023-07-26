use starknet::{ContractAddress, class_hash::ClassHash};

#[starknet::interface]
trait IUFCDMeta<T> {
    fn deploy_contract(
        ref self: T, class_hash: ClassHash, salt: felt252, calldata: Span<felt252>, zeroable: bool
    ) -> ContractAddress;
}

#[starknet::contract]
mod UFCDMeta {
    use core::serde::Serde;
    use starknet::{ContractAddress, contract_address_to_felt252, get_caller_address};
    use starknet::{syscalls::deploy_syscall, class_hash::ClassHash};
    use hash::pedersen;


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ContractDeployed: ContractDeployed
    }

    #[derive(Drop, starknet::Event)]
    struct ContractDeployed {
        address: ContractAddress,
        deployer: ContractAddress,
        from_zero: bool,
        class_hash: ClassHash,
        calldata: Span<felt252>,
        salt: felt252
    }

    #[storage]
    struct Storage {}

    #[external(v0)]
    impl UFCDMeta of super::IUFCDMeta<ContractState> {
        fn deploy_contract(
            ref self: ContractState,
            class_hash: ClassHash,
            mut salt: felt252,
            calldata: Span<felt252>,
            zeroable: bool
        ) -> ContractAddress {
            let deployer = get_caller_address();
            if (zeroable) {
                salt = pedersen(salt, contract_address_to_felt252(deployer));
            }
            let res = deploy_syscall(class_hash, salt, calldata, zeroable);
            let (address, _) = res.unwrap_syscall();
            self
                .emit(
                    ContractDeployed {
                        address, deployer, from_zero: zeroable, class_hash, calldata, salt
                    }
                );
            address
        }
    }
}

