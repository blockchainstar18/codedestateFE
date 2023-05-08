import { useState, useEffect } from 'react'

import logo from '../../../assets/images/sei.png';
import nft from '../../../assets/images/nft.jpg';

import { WalletConnectButton } from '@sei-js/react';
import { useWallet, useCosmWasmClient, useSigningCosmWasmClient } from '@sei-js/react';
import { calculateFee, GasPrice, coin } from '@cosmjs/stargate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const chainId = 'atlantic-2'
// const restUrl = 'https://sei-testnet-2-rest.brocha.in:443'
// const rpcUrl = 'https://sei-testnet-2-rpc.brocha.in:443'
const contractAddress = 'sei1l6c37a5xenquyjxjvsehcn4j97tca94k4yk2uzfmpeamu2vw350qmypwq4'

function MintPage() {
    const [count, setCount] = useState(0)
    const { connectedWallet, offlineSigner, accounts } = useWallet();

    const { cosmWasmClient } = useCosmWasmClient()
    const { signingCosmWasmClient } = useSigningCosmWasmClient()
    const [flag, setflag] = useState(false)
    const [remainNFT, setRemain] = useState(100000)
    const [tokenImg, setTokenImg] = useState('')

    function mintCount() {
        const query = {
            num_tokens: {
            }
            // nft_info: {
            // token_id: '31',
            /// unset or false will filter out expired approvals, you must set to true to see them
            // include_expired: false
            // }
        };
        // console.log(query);
        cosmWasmClient?.queryContractSmart(contractAddress, query).then((res) => {
            console.log(res)
            const c = 100000 - res.count
            // console.log(c)
            setRemain(c)
        }).catch((err) => {
            console.log(err)
        })

    }

    useEffect(() => {
        // console.log('mint asdf')
        mintCount()


    }, [flag, cosmWasmClient])


    const imageShow = (token_uri) => {
        console.log(token_uri)
        fetch(token_uri).then(res => {
            res.json().then(res => {
                console.log(res.properties.image.description)
                setTokenImg(res.properties.image.description)
            })
        })
    }

    const mintNFT = async () => {

        // const query = {
        //   owner_of: {
        //     token_id: '2'
        //   }
        // };

        // cosmWasmClient?.queryContractSmart(contractAddress, query).then((res) => {
        //   console.log(res)
        // }).catch((err) => {
        //   console.log(err)
        // })





        // if (!accounts[0]?.address) {
        //     toast(<div className='text-red-600'>Wallet not connected!</div>)
        //     return
        // }

        // if (1) {
        //     toast.error('Sorry, NFT minting is paused now.')
        //     return
        // }
        const fee = calculateFee(150000, "0.1usei");

        const amount = [{ amount: "100000", denom: "usei" }]
        const query = {
            num_tokens: {
            }
        };


        cosmWasmClient?.queryContractSmart(contractAddress, query).then((res) => {
            console.log(res.count)
            const tokenId = (res.count + 1).toString()
            console.log(tokenId)

            const msg = {
                mint: {
                    token_id: tokenId,
                    owner: accounts[0]?.address,
                    //bafybeiff7qheqlovhmz5t4dhu3q6zjijm7uxlfbhu4r6syx3fcu4i7f6wy
                    //bafybeicv2dvbxcq72pzfbxjuhivxnljyzttyfcxs3djrl6abaax56s5be4
                    token_uri: 'https://nftstorage.link/ipfs/bafybeicfjlcheitcxxaf6g53rmnprwfb6kuzjgbawj5krjvn7rckm5koum/' + tokenId + '.json',
                    extension: {},
                },
                // transfer_nft: { recipient: 'sei166v9p8yfca65um5p3vp05h648ufmtu33zd0d8e', token_id: '31' },
            };



            signingCosmWasmClient?.execute(accounts[0].address, contractAddress, msg, fee).then(r => {
                console.log(r)
                setflag(true)
                imageShow(msg.mint.token_uri)
                toast.success(`Mint Successful! Tx hash:${r.transactionHash}}`)

            }).catch((err) => {
                console.log(err)
                toast.error(`${err.toString()}`)
            })

        }).catch((err) => {
            console.log(err)
            toast.error(`${err.toString()}`)
        })

        // signingCosmWasmClient.sendTokens(accounts[0].address, 'sei12wd704w8sts0jud4mrplq2j9j0y8366dxn4395', amount, fee).then((r) => {
        //     toast.success(`Sent sei Successfully! Tx hash:${r.transactionHash}}`)
        //     console.log(r)



        // }).catch((err) => {
        //     console.log(err)
        //     toast.error(`${err.toString()}`)
        // })









    }

    return (

        <div>
            <ToastContainer></ToastContainer>
            <div className='text-left fw-bold fs-5'>
                Mint Your Token
            </div>
            {/* <div>
                NFTs drop April 15th, at 2:00 PM UTC
            </div> */}
            <div class="d-flex justify-content-center" style={{ "marginTop": "50px" }}>
                <div class="border border-gray rounded-2 d-flex justify-content-around p-2 bd-highlight" style={{ "width": "400px" }}>
                    <div className='flex-column'>
                        <div className='d-flex flex-row'>
                            <div style={{ "width": "6px", "height": "6px", "borderRadius": "3px", "background": "green", "marginTop": "10px" }}></div>
                            <div>Status</div>
                        </div>
                        <div className='fw-bold fs-5'>Live</div>
                    </div>
                    <div className='flex-column'>
                        <div className='d-flex flex-row'>
                            <img src={logo} style={{ "width": "20px", "height": "20px", "marginTop": "3px" }}></img>
                            <div>Price</div>
                        </div>
                        <div className='fw-bold fs-5'>Free</div>
                    </div>
                    <div className='flex-column'>
                        <div>Remaining</div>
                        <div className='fw-bold fs-5'>{remainNFT}</div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center" style={{ "marginTop": "100px" }}>
                <img style={{ "width": "300px", "height": "300px", "borderRadius": "150px" }} src={nft}></img>
            </div>
            <div class="d-flex justify-content-center" style={{ "marginTop": "100px" }}>
                <div className='mintbtn' onClick={() => {
                    mintNFT()
                }}>Mint Your NFT</div>
            </div>
            {
                flag && (
                    <div>
                        <div class="d-inline-flex p-2 fs-5 fw-bold mt-6">Your NFT</div>
                        <div class="d-flex justify-content-center" style={{ "marginBottom": "100px" }}>

                            <img style={{ "width": "300px", "height": "300px" }} src={tokenImg}></img>
                        </div>
                    </div>
                )
            }


        </div>



        // <div>
        //     <div className='text-[20px] font-bold ml-1'>Mint Your Token</div>
        //     <div className='text-[14px] ml-1'>NFTs drop March 15th, at 2:00 PM UTC</div>

        //     <div className='mx-auto mt-3 max-w-[150px] text-center px-[5px] bg-[#301570] font-bold py-[5px] text-white rounded-[10px] cursor-pointer'>
        //         <WalletConnectButton />
        //     </div>

        //     <ToastContainer />

        //     <div className='w-[70vw] max-w-[500px] h-[70px] pt-[10px] mx-auto mt-[5vh]  shadow-[0_0_0_2px_rgba(0,0,0,0.1)] flex-row text-center rounded-[5px]'>
        //         <div className='mx-auto'>
        //             <div className='flex'>
        //                 <div className='w-[6px] h-[6px] bg-[#00ff00] rounded-[3px] my-auto mr-1'></div>
        //                 <div className='text-[14px]'>

        //                     Status</div></div>
        //             <div className='text-[20px] font-bold'>Open</div>
        //         </div>
        //         <div className='mx-auto'>
        //             <div className='flex'>
        //                 <img src={logo} className='w-[20px] h-[20px] my-auto mr-1'></img>
        //                 <div className='text-[14px]'>

        //                     Price</div></div>
        //             <div className='text-[20px] font-bold'>Free</div>
        //         </div>
        //         <div className='mx-auto'>
        //             <div className='text-[14px]'>Remaining</div>
        //             <div className='text-[20px] font-bold'>{remainNFT}</div>
        //         </div>

        //     </div>
        //     <img src={nft} className='mx-auto my-[15vh] w-[200px] rounded-[100px]'></img>
        //     <div className='mx-auto text-center w-[300px] h-[50px] bg-[#301570] font-bold pt-[12px] text-white rounded-[10px] cursor-pointer' onClick={() => {
        //         mintNFT()
        //     }}>Mint Your NFT</div>

        // </div>
    )
}

export default MintPage;
