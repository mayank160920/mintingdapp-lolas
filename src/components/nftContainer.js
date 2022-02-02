import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

function NftContainer(props) {

    const blockchain = useSelector((state) => state.blockchain);
    const [nftsLoaded, setNftsLoaded] = useState(false);
    const [nftIds, setNftIds] = useState([]);

    const fetchNfts = async () => {
        let _nftIds = [];

        const result = await blockchain.degenrabbitSmartContract.methods.walletOfOwner(
            // blockchain.account
            "0xCF4F33773bd0b5F89271143062EEF0C6Dd408063"
        ).call();
        if (result.length != 0) {
            _nftIds = _nftIds.concat(result.slice(1080));
        }

        const tokensUnderCustody = await blockchain.custodySmartContract.methods.getCustodiedTokensForOwner(
            "0x8E7c434B248d49D873D0F8448E0FcEc895b1b92D",
            "0x972217838ee9849662cd63cd0d0fcafa09eb25f4"
            // blockchain.account
        ).call();
        if (tokensUnderCustody.length != 0) {
            // _nftIds = _nftIds.concat(tokensUnderCustody);            
        }

        setNftIds(_nftIds);
        setNftsLoaded(true);
    }


    const getIPFSImageUrl = (tokenId) => {
        return `https://ipfs.io/ipfs/QmfNMUDEUuCkJdbejeHfS52zowT6TG2v1bXGeZhNohDMFh/${tokenId}.png`
    }

    useEffect(() => fetchNfts(), []);

    return (
        <div className='nftContainer'>
            {/* {blockchain.account ? blockchain.account : "No account connected"} */}
            {
                nftsLoaded
                    ? ""
                    : <p>Just a minute...</p>
            }
            {
                nftIds.length == 0 && nftsLoaded
                    ? <p>Oops! Looks like you don't own any DegenerabBit</p>
                    : ""
            }
            {
                nftIds.length == 0
                    ? ""
                    : nftIds.map((_nftId) => {
                        return (
                            <div key={_nftId} className='nftImageHolder'>
                                <img src={getIPFSImageUrl(_nftId)} width={180} height={180}></img>
                                <p>DegenerabBits #{_nftId}</p>
                                <a onClick={() => {
                                    props.claimNFTs(_nftId);
                                    props.getData();
                                }}>MINT</a>
                            </div>
                        )
                    })
            }
        </div>
    );
}

export default NftContainer;
