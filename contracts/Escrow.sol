pragma solidity ^0.8.17;

contract Escrow {
    enum DealStatus { PENDING, FUNDED, RELEASED, REFUNDED }
    struct Deal {
        address buyer;
        address seller;
        uint256 amount;
        DealStatus status;
    }
    mapping(uint256 => Deal) public deals;
    uint256 public dealCounter;
    function createDeal(address _seller) external returns (uint256) {
        dealCounter++;
        deals[dealCounter] = Deal({
            buyer: msg.sender,
            seller: _seller,
            amount: 0,
            status: DealStatus.PENDING
        });
        return dealCounter;
    }
    function fundDeal(uint256 _dealId) external payable {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.buyer);
        require(deal.status == DealStatus.PENDING);
        require(msg.value > 0);
        deal.amount = msg.value;
        deal.status = DealStatus.FUNDED;
    }
    function releaseFunds(uint256 _dealId) external {
        Deal storage deal = deals[_dealId];
        require(msg.sender == deal.buyer);
        require(deal.status == DealStatus.FUNDED);
        deal.status = DealStatus.RELEASED;
        payable(deal.seller).transfer(deal.amount);
    }
}
