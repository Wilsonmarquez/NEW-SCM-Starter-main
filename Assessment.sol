// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Buy(uint256 amount);
    event Sell(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function buy(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Buy(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 sellAmount);

    function sell(uint256 _sellAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _sellAmount) {
            revert InsufficientBalance({
                balance: balance,
                sellAmount: _sellAmount
            });
        }

        // sell the given amount
        balance -= _sellAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _sellAmount));

        // emit the event
        emit Sell(_sellAmount);
    }
}
