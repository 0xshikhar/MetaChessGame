
## How to play

1. Login to your wallet using the authenticate button
2. Test tokens will be automatically transferred to your wallet
3. Stake the GHODA tokens to convert them into sGHODA tokens
4. Join quick match with along with a friend
5. Play.
6. Claim your prize.
7. Wait for some time for the NFTs to appear on the page. (IPFS takes some time to load the data)

## Geek Stuff Ahead

There are 4 contracts who govern the ownership of the games played.

1. `Master` - Holds the power to govern all the other contracts and lock or unlock `sGHODA` (staked `GHODA`)
2. `ERC1155` - NFT
3. `ERC20` - `GHODA` Token
4. `ELO` - Manages player ratings on-chain.

The game is built with Moralis as a Cloud provider. There are cloud functions for

- Verifying each move sent by the user.
- Joining the challenge pool.
- Resigning, claiming victory.
- Creating custom challenges to send friends/competitors.

The game states are observed and stored on Moralis to track wins. The winners can claim their prize pool or demand an NFT, too. Claiming party would invoke a function that triggers the Oracle deployed on StackOS. This Oracle now invokes smart contract functions to end the game.

The smart contracts are air tight against replay attacks.

Only whitelisted oracles can submit the transactions. This limitation can and will be removed as soon as Web3 can support a fully decentralised cloud with privacy and security.

Staked MetaChess Coin- https://mumbai.polygonscan.com/tx/0x6726b65e9f8881eb48786e1ef021aad7aff267e9f599174999c48a277866178f
MetaChess Coin Creation (Polygon) - https://mumbai.polygonscan.com/tx/0x33073c2d23866bcb44bc4670429c4f76d35efdb48b4801105b1c154595bd6e68
ERC1155 NFT: https://mumbai.polygonscan.com/address/0x8d88dC0fF21b5da42700dfF59D881056D02B17B6#code

---

## Challenges, Ideas and Sacrifices

Web3 is about owning the facts. The fact that you won, or that you are indeed the person who won and should get the staked tokens.

Chess dApp sounds an easy task to pull off. Here are some of the ideas we came up with. The check box denotes if we iterated over the idea.

