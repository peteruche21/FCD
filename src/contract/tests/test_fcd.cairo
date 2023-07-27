use core::debug::PrintTrait;
use array::ArrayTrait;
use result::ResultTrait;
use option::OptionTrait;
use traits::Into;
use traits::TryInto;
use starknet::class_hash::Felt252TryIntoClassHash;
use starknet::{ContractAddress};
use starknet::syscalls::deploy_syscall;
use fcd::fcd::UFCDMeta;
use fcd::fcd::IUFCDMetaDispatcher;
use fcd::fcd::IUFCDMetaDispatcherTrait;

#[test]
#[available_gas(30000000)]
fn test_deploy_contract() {
    let mut calldata = ArrayTrait::new();
    let (address_fcd, _) = deploy_syscall(
        UFCDMeta::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
    )
        .unwrap();

    let deployed_contract = IUFCDMetaDispatcher { contract_address: address_fcd };
    let implicit_deployed_contract = deployed_contract
        .deploy_contract(UFCDMeta::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false);

    address_fcd.print();
    implicit_deployed_contract.print();
}
