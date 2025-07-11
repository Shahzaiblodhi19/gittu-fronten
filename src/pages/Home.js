import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import ReactModal from "react-modal";
import Logo from '../assets/logo.png';
import tel_ico from '../assets/tel-ico.svg';
import dis_ico from '../assets/dis-ico.svg';
import twi_ico from '../assets/twi-ico.svg';
import o_ico from '../assets/o-ico.svg';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import WalletConnectProvider from "@walletconnect/web3-provider";
import i_ico from '../assets/i-ico.svg';
import lin_ico from '../assets/lin-ico.svg';
import { useLocation } from "react-router-dom";  // For getting the current path
import bg_part from '../assets/bg-part.svg';
import head1 from '../assets/head-img.svg';
import map_bar from '../assets/map-bar.svg';
import head2 from '../assets/head-2.svg';
import Sol from '../assets/sol.png'
import referal_img from "../assets/refferal-bg.svg";
import Slider from 'react-slick';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from '@project-serum/anchor';
import { SOL_DECIMALS } from "./web3/constants";

import {
    SOLANA_HOST,
    getAdmin,
    depositAltToken,
    claimAltToken,
    claimSol,
    buyToken,
    updateGlobalState,
    getStateInitialized,
    getTotalSuplyToken,
    getTokenDecimal,
    createGlobalState,
    createTokenAccount,
    getPrice,
    getMaxAmount,
    showToast,
    getVaultKey,
    getSoldInfo,
    depositRealToken,
    claimRealToken,
    swapToken,
    getTokenFromBalance,
} from "./web3/web3";

const connection = new anchor.web3.Connection(SOLANA_HOST);

// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Modal Style Configuration
ReactModal.setAppElement("#root");

function Home() {
    const [saleProgress, setSaleProgress] = useState(20000);
    const [totalSupply] = useState(100000);
    const [bonus, setBonus] = useState(20);
    const [countdown, setCountdown] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);

    // Handle video load completion
    const handleVideoLoad = () => {
        setIsLoading(false); // Hide loader once the video is loaded
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the video section is in the viewport, start playing
                if (entry.isIntersecting) {
                    setIsVideoPlaying(true);
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the video section is visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        // Clean up observer on unmount
        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);
    const [balance, setWalletBalance] = useState(0);

    const wallet = useWallet();

    useEffect(() => {
        fetchBalance();
    }, [connection, wallet])

    const fetchBalance = async () => {
        try {
            if (!wallet || !wallet.publicKey) {
                // setAdmin(false);
                return;
            }

            // setMaxAmount(MAX_VAL);
            // const stateInit = await getStateInitialized(wallet);

            // setIsState(!!stateInit);

            // const adm = await getAdmin(wallet);
            // setAdmin(adm);
            console.log("wallet:", wallet.publicKey.toString());
            const balance1 = await connection.getBalance(wallet.publicKey);
            console.log("balance1:", balance1);
            setWalletBalance(balance1 / 10 ** SOL_DECIMALS);

            // const tokenAccount = await getAssociatedTokenAddress(ALT_TOKEN_PUBKEY, wallet.publicKey);
            // const accountInfo = await getAccount(connection, tokenAccount);
            // setTokenBalance(Number(accountInfo.amount) / 10 ** TOKEN_DECIMALS);

            // const sold_amount = await getSoldInfo(wallet);
            // setTotalAmount(sold_amount);

            // const priceSEC = await getPrice(wallet);

            // if (priceSEC)
            //     onSetTokenPrice(priceSEC);

        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }
    // Countdown Timer (63 days, 8 hours)
    useEffect(() => {
        const targetDate = new Date().setDate(new Date().getDate() + 63);
        const interval = setInterval(() => {
            const now = new Date();
            const timeLeft = targetDate - now;
            setCountdown(timeLeft);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getRemainingTime = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        return (
            <>
                <div className="counter">
                    <span className="days">{days}<span className="unit">d</span></span><svg xmlns="http://www.w3.org/2000/svg" width="7" height="24" viewBox="0 0 7 24" fill="none">
                        <rect y="0.0724487" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                        <rect y="17.2529" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                    </svg>
                    <span className="hours">{hours}<span className="unit">h</span></span><svg xmlns="http://www.w3.org/2000/svg" width="7" height="24" viewBox="0 0 7 24" fill="none">
                        <rect y="0.0724487" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                        <rect y="17.2529" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                    </svg>
                    <span className="minutes">{minutes}<span className="unit">m</span></span><svg xmlns="http://www.w3.org/2000/svg" width="7" height="24" viewBox="0 0 7 24" fill="none">
                        <rect y="0.0724487" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                        <rect y="17.2529" width="6.99656" height="6.60786" rx="1" fill="white" fill-opacity="0.2" />
                    </svg>
                    <span className="seconds">{seconds}<span className="unit">s</span></span>
                </div>
            </>
        );
    };

    const percentage = (saleProgress / totalSupply) * 100;

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(`gittu-ebon.vercel.app/referral?user=286254`);
        alert("Referral link copied to clipboard!");
    };

    const data = {
        labels: [
            '15% Distribute to Community',
            '18% Reserved Funding',
            '13% Founders and Team',
            '9% Advisors',
            '10% Bounty Campaign',
        ],
        datasets: [
            {
                data: [15, 18, 13, 9, 10], // Percentage values
                backgroundColor: ['#5874cf', '#f09790', '#8761a8', '#16bf86', '#ffae57'],
                hoverBackgroundColor: ['#5874cf', '#f09790', '#8761a8', '#16bf86', '#ffae57'],
                borderWidth: 2,
            },
        ],
    };

    // Chart Options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right', // You can change the position to 'left', 'top', 'bottom', or 'right'
                labels: {
                    boxWidth: 25, // Change the width of the color box (circle)
                    padding: 25,  // Spacing between legend items
                    boxRadius: 50, // Adding border radius for rounded corners
                    font: {
                        size: 16, // Adjust font size of the legend text
                        family: 'outfit', // You can also set the font family here
                        weight: '400', // You can adjust the font weight (e.g., 'normal', 'bold', 'lighter')
                    },
                    boxHeight: 10, // Adjust the height of the legend box
                    filter: (legendItem, chartData) => {
                        return legendItem.datasetIndex !== 2; // Example: Filter out the 3rd item from the legend
                    },
                },
                offset: 20,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                },
            },
        },
    };

    const [blogPosts, setblogPosts] = useState([])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("https://node-server-beryl.vercel.app/api/blogs");
                const data = await response.json();
                console.log(data)
                setblogPosts(data);  // Set the fetched blogs into state
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();  // Call the function to fetch blogs
    }, []);
    const settings = {
        infinite: blogPosts.length > 4,
        speed: 500,
        slidesToShow: 4, // Show 4 slides by default
        slidesToScroll: 1, // Scroll one slide at a time
        dots: false, // Disable dots for navigation
        autoplay: false, // Enable auto-play
        autoplaySpeed: 2000, // Speed for auto-play
        centerMode: false, // Ensure slides start from the left
        responsive: [
            {
                breakpoint: 1024, // Medium devices (like tablets)
                settings: {
                    slidesToShow: 2, // Show 2 slides on medium screens
                    slidesToScroll: 1, // Scroll 1 slide at a time
                },
            },
            {
                breakpoint: 600, // Small devices (like mobile)
                settings: {
                    slidesToShow: 1, // Show 1 slide on small screens
                    slidesToScroll: 1, // Scroll 1 slide at a time
                },
            },
        ],
    };



    const [activeIndex, setActiveIndex] = useState(1);

    const faqData = [
        {
            question: "Can American citizens take part in the crowdsale?",
            answer: "JavaScript is also used in environments that aren’t web-based, such as PDF documents, site-specific browsers, and desktop widgets. Newer and faster JavaScript virtual machines (VMs) and platforms built upon them have also increased the popularity of JavaScript for server-side web applications. On the client side, JavaScript has been traditionally implemented as an interpreted language, but more recent browsers per."
        },
        {
            question: "Does the crowdsale comply with legal regulations?",
            answer: "The legal regulations around crowdsales ensure the project follows the necessary laws and guidelines. In many jurisdictions, a token sale or crowdsale is regulated to protect the investors, as well as to ensure transparency and fairness."
        },
        {
            question: "Can I trade SCR at an exchange?",
            answer: "Yes, SCR (Scorum) can be traded on various exchanges like Binance, and other supported exchanges that offer SCR trading pairs."
        },
        {
            question: "Why is Scorum’s economic model sustainable?",
            answer: "Scorum's model leverages blockchain technology to ensure fairness, transparency, and a direct connection between sports enthusiasts and sports content creators. The decentralized nature supports the long-term growth of the platform."
        },
        {
            question: "Can I mine SCR?",
            answer: "Mining of SCR is possible through proof-of-stake mechanisms, allowing users to earn SCR tokens by staking their tokens. The mining process is secure and sustainable, using blockchain technology to prevent fraud and exploitation."
        }, {
            question: "Does the crowdsale comply with legal regulations?",
            answer: "The legal regulations around crowdsales ensure the project follows the necessary laws and guidelines. In many jurisdictions, a token sale or crowdsale is regulated to protect the investors, as well as to ensure transparency and fairness."
        },
        {
            question: "Can I trade SCR at an exchange?",
            answer: "Yes, SCR (Scorum) can be traded on various exchanges like Binance, and other supported exchanges that offer SCR trading pairs."
        },
        {
            question: "Why is Scorum’s economic model sustainable?",
            answer: "Scorum's model leverages blockchain technology to ensure fairness, transparency, and a direct connection between sports enthusiasts and sports content creators. The decentralized nature supports the long-term growth of the platform."
        },
    ];

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 5) {
            setIsScrolled(true); // Add black background when scrolling down
        } else {
            setIsScrolled(false); // Reset to transparent when at the top
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const adminAddress = '3CLc2511wqVpJVwN5g2s5ZEcGK5ZwymKJvrHABcC5Ewe';

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the email
        if (!email) {
            setMessage('Please enter a valid email.');
            return;
        }

        try {
            const response = await fetch('https://node-server-beryl.vercel.app/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Successfully subscribed!');
            } else {
                setMessage(data.error || 'An error occurred');
            }
        } catch (err) {
            setMessage('An error occurred while subscribing');
        }
    };
    const location = useLocation();  // Hook to get current route

    // Conditional check for the current route
    const isOnHomePage = location.pathname === "/";  // Check if on / page

    const [ResponsiveModal, setResponsiveModal] = useState(false)
    const [solAmount, setSolAmount] = useState('0');
    const [gittuAmount, setGittuAmount] = useState('0');
    // Assuming a static conversion rate for SOL to Gittu (1 SOL = 100 GITTU)
    const convertToGittu = (solAmount) => {
        const conversionRate = 100; // Example conversion rate
        return solAmount * conversionRate;
    };

    const handleSolAmountChange = (event) => {
        const amount = event.target.value;
        setSolAmount(amount);

        if (amount > 0) {
            const convertedAmount = convertToGittu(amount);
            setGittuAmount(convertedAmount);
        } else {
            setGittuAmount(0);
        }
    };


    useEffect(() => {
        if (isModalOpen) {
            // Disable scrolling when the modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling when the modal is closed
            document.body.style.overflow = 'auto';
        }

        // Cleanup: reset overflow when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const [ModalStage, setModalStage] = useState('');
    const handleBuyNow = async () => {
        setIsModalOpen(!isModalOpen);
        setModalStage('Success');
        setModalStage('Error');
    };

    return (
        <>
            <div className="app-section" id="main">
                <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                    <div className="mm">
                        {isOnHomePage ? (
                            // If on the homepage ("/"), use ScrollLink for smooth scrolling
                            <ScrollLink
                                to="main"  // Scroll to the "main" section
                                smooth={true}
                                duration={500}
                                className="logo"
                                style={{ cursor: 'pointer' }}
                            >
                                <img src={Logo} alt="Logo" />
                            </ScrollLink>
                        ) : (
                            // If not on the homepage, use RouterLink to navigate to the homepage
                            <>
                                <Link to="/" className="logo">
                                    <img src={Logo} alt="Logo" />
                                </Link>

                            </>
                        )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <div className="nav ">
                           {wallet.publicKey?.toString() === adminAddress ? (
    <button>
        <Link to="/all-blogs" style={{ textDecoration: 'none', color: 'white' }}>
            Create Blog
        </Link>
    </button>
) : null}

                            <button className="hmm"><ScrollLink to="affiliate"
                                smooth={true}  // Enable smooth scrolling
                                duration={500} // Duration of the scroll (in ms)
                                style={{ textDecorationLine: 'none', color: 'white' }}>Affiliate Program</ScrollLink></button>
                            <button className="hmm"><ScrollLink to="roadmap"
                                smooth={true}  // Enable smooth scrolling
                                duration={500} // Duration of the scroll (in ms)
                                style={{ textDecorationLine: 'none', color: 'white' }}>Road Map</ScrollLink></button>
                            <button className="hmm"><ScrollLink to="token"
                                smooth={true}  // Enable smooth scrolling
                                duration={500} // Duration of the scroll (in ms)
                                style={{ textDecorationLine: 'none', color: 'white' }}>Token Distribution</ScrollLink></button>
                            <button className="hmm"><ScrollLink to="blog"
                                smooth={true}  // Enable smooth scrolling
                                duration={500} // Duration of the scroll (in ms)
                                style={{ textDecorationLine: 'none', color: 'white' }}>Blogs</ScrollLink></button>
                            <button className="hmm"><ScrollLink to="faq"
                                smooth={true}  // Enable smooth scrolling
                                duration={500} // Duration of the scroll (in ms)
                                style={{ textDecorationLine: 'none', color: 'white' }}>Faqs</ScrollLink></button>

                            <div className="d-flex align-items-center" style={{ gap: '18px' }}>
                                <WalletMultiButton className="wallet-btn hid" />
                                <button onClick={() => setResponsiveModal(!ResponsiveModal)} className="toggle-btns hid11" style={{ display: 'none' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 80 80" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 22.5C10 21.837 10.2634 21.2011 10.7322 20.7322C11.2011 20.2634 11.837 20 12.5 20H67.5C68.163 20 68.7989 20.2634 69.2678 20.7322C69.7366 21.2011 70 21.837 70 22.5C70 23.163 69.7366 23.7989 69.2678 24.2678C68.7989 24.7366 68.163 25 67.5 25H12.5C11.837 25 11.2011 24.7366 10.7322 24.2678C10.2634 23.7989 10 23.163 10 22.5ZM10 40C10 39.337 10.2634 38.7011 10.7322 38.2322C11.2011 37.7634 11.837 37.5 12.5 37.5H67.5C68.163 37.5 68.7989 37.7634 69.2678 38.2322C69.7366 38.7011 70 39.337 70 40C70 40.663 69.7366 41.2989 69.2678 41.7678C68.7989 42.2366 68.163 42.5 67.5 42.5H12.5C11.837 42.5 11.2011 42.2366 10.7322 41.7678C10.2634 41.2989 10 40.663 10 40ZM37.5 57.5C37.5 56.837 37.7634 56.2011 38.2322 55.7322C38.7011 55.2634 39.337 55 40 55H67.5C68.163 55 68.7989 55.2634 69.2678 55.7322C69.7366 56.2011 70 56.837 70 57.5C70 58.163 69.7366 58.7989 69.2678 59.2678C68.7989 59.7366 68.163 60 67.5 60H40C39.337 60 38.7011 59.7366 38.2322 59.2678C37.7634 58.7989 37.5 58.163 37.5 57.5Z" fill="white" />
                                </svg></button>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container" style={{ paddingTop: '110px' }}>
                    <div className="row">
                        <div className="content col-xl-7 col-12">
                            <img style={{ position: 'absolute', left: '-30px', top: '24px', height: '95%' }} className="" src={bg_part} alt="part-bg" />
                            {/* , zIndex:"0"  */}
                            <div className="sale-details w-100" style={{ zIndex: 1 }}>

                                <h1>Invest in the  <img className="mx-3 mb-1 i1" src={head1} alt="" /> <br /> </h1>
                                <h1 className="mt-3"><span style={{ color: '#65EA88' }} >Future </span> of <img className="mx-2 i2" src={head2} alt="" />  Finance</h1>
                                <p className="par ">Buy tokens now and reap the benefits of the blockchain revolution!</p>

                                <div className="d-flex align-items-center justify-content-between bars" style={{ width: '80%' }}>
                                    <p className="progress-info">Stage 1: {bonus}% Bonus!</p>
                                    <div className="progress-info">
                                        <span>{saleProgress}/{totalSupply}</span>
                                    </div>
                                </div>
                                <div className="progress-bar bars">
                                    <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
                                        {`${percentage}%`}
                                    </div>
                                </div>
                                <p className="mt-4 text-white mm">1 GITTU = 0.001 USD <br />
                                    NEXT STAGE = 0.002 USD</p>
                                <p className="mt-4 text-white mm">Your Balance :  <span style={{ fontSize: '14px', fontWeight: '600', marginLeft: '10px' }}>{balance} SOL</span><br />
                                </p>
                                <div className="buy">
                                    <div className="input-section">
                                        <label className="mb-3" style={{ fontSize: '12px', fontWeight: '600' }}>AMOUNT</label>
                                        <div className="input-wrapper position-relative">
                                            <input
                                                value={solAmount}
                                                onChange={handleSolAmountChange}
                                                className="input"
                                            />
                                            <span className="d-flex align-items-center" style={{ position: 'absolute', right: '20px', gap: '6px', fontSize: '14px' }}><img style={{ width: '15px', height: '15px' }} src={Sol}
                                                alt="solana" />SOL</span>
                                        </div>
                                    </div>

                                    <div className="input-section">
                                        <label className="mb-3" style={{ fontSize: '12px', fontWeight: '600' }}>GET AMOUNT (GITTU)</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="number"
                                                value={gittuAmount}
                                                readOnly
                                                placeholder="Converted amount"
                                                className="input"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <button className="buy-now pointer-cursor" onClick={handleBuyNow}>BUY NOW</button>
                            </div>
                        </div>
                        <div className="col-xl-5 col-12">
                            <div className="right-sec right-hid">
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <div className="overlay-img">
                                        <img src="data:image/svg+xml,%3csvg%20width='106'%20height='129'%20viewBox='0%200%20106%20129'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_2_1188)'%3e%3cpath%20d='M106%2087.865C106%20100.466%20102.25%20109.922%2095.9538%20115.533C93.9708%20117.302%2082.073%20125.589%2079.624%20126.572C71.3489%20129.895%2070.2853%20121.721%2058.5655%20115.013C32.3674%20100.021%2011.1309%2063.557%2011.1309%2033.57C11.1309%2022.1322%203.49564%2020.4352%208.77086%2014.7016C10.1437%2013.2104%2022.3932%204.7843%2024.0457%203.72159C32.6936%20-1.8314%2044.9601%20-1.36515%2058.5655%206.42248C84.7636%2021.4139%20106%2057.878%20106%2087.865Z'%20fill='url(%23paint0_linear_2_1188)'/%3e%3cpath%20d='M94.8649%2095.43C94.8649%20125.417%2073.6284%20137.573%2047.4303%20122.578C21.2322%20107.582%200%2071.1178%200%2041.1308C0%2011.1438%2021.2364%20-1.00811%2047.4345%2013.9833C73.6284%2028.9789%2094.8649%2065.443%2094.8649%2095.43Z'%20fill='url(%23paint1_linear_2_1188)'/%3e%3cpath%20d='M76.9509%20119.128C93.3333%20109.751%2093.3338%2079.3473%2076.9519%2051.2195C60.5701%2023.0917%2034.0094%207.89102%2017.627%2017.2678C1.24456%2026.6446%201.2441%2057.0481%2017.6259%2085.1759C34.0078%20113.304%2060.5685%20128.504%2076.9509%20119.128Z'%20stroke='%2384E4A4'%20stroke-width='0.6873'%20stroke-miterlimit='10'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_2_1188'%20x1='166.254'%20y1='28.7716'%20x2='55.8176'%20y2='64.1084'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.0873'%20stop-color='%2384E4A4'/%3e%3cstop%20offset='0.9709'%20stop-color='%233C53D7'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_2_1188'%20x1='45.5899'%20y1='22.1576'%20x2='3.18783'%20y2='106.806'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.0873'%20stop-color='%2384E4A4'/%3e%3cstop%20offset='0.9709'%20stop-color='%233C53D7'/%3e%3c/linearGradient%3e%3cclipPath%20id='clip0_2_1188'%3e%3crect%20width='106'%20height='129'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e" alt="coin" />
                                    </div>
                                    <div className="bg-blur-right">
                                        <div className="countdown">
                                            <h2>Pre-Sale ends in</h2>
                                            <h1>{getRemainingTime(countdown)}</h1>
                                            <div className="socials mt-5">
                                                <a href='https://web.telegram.org/'><img src={tel_ico} alt="telegram" /></a>
                                                <a href='https://discord.com/'><img src={dis_ico} alt="discord" /></a>
                                                <a href='https://twitter.com/'><img src={twi_ico} alt="twitter" /></a>
                                                <a href='https://medium.com/'><img src={o_ico} alt="medium" /></a>
                                                <a href='https://www.reddit.com/?rdt=49993'><img src={i_ico} alt="reddit" /></a>
                                                <a href='https://www.linkedin.com/'><img src={lin_ico} alt="linkedin" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Connection Modal */}
                    <ReactModal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        className="modals"
                    >
                        <button className="w-auto close mt-0 ml-auto" onClick={() => setIsModalOpen(false)} style={{ padding: '11px', borderRadius: '50px', marginLeft: 'auto' }}><svg aria-hidden="true" fill="none" height="10" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg"><title>Close</title><path d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z" fill="currentColor"></path></svg></button>
                        {ModalStage === 'Error' &&
                            <div className="content text-center">
                                <svg className="error-icon" width="75px" height="75px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd"></path></g></svg>
                                <h2 className="mt-4" style={{ fontSize: '22px' }}>Error</h2>
                                <p className="px-5 mt-2" style={{ fontSize: '13px', color: '#c1cade' }}>Something went wrong with your transaction. Please try again later.</p>
                            </div>}
                        {ModalStage === 'Success' && <div className="content text-center">
                            <svg className="success-icon" width="80px" height="80px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.144"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z"></path> </g></svg>
                            <h2 className="mt-4" style={{ fontSize: '22px' }}>Purchase Successful</h2>
                            <p className="px-4 mt-2" style={{ fontSize: '13px', color: '#c1cade' }}>Your purchase of {solAmount} SOL worth of GITTU tokens has been successfully completed.</p>
                        </div>}

                    </ReactModal>
                </div>
                <div className="right-sec right-show">
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <div className="overlay-img">
                            <img src="data:image/svg+xml,%3csvg%20width='106'%20height='129'%20viewBox='0%200%20106%20129'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_2_1188)'%3e%3cpath%20d='M106%2087.865C106%20100.466%20102.25%20109.922%2095.9538%20115.533C93.9708%20117.302%2082.073%20125.589%2079.624%20126.572C71.3489%20129.895%2070.2853%20121.721%2058.5655%20115.013C32.3674%20100.021%2011.1309%2063.557%2011.1309%2033.57C11.1309%2022.1322%203.49564%2020.4352%208.77086%2014.7016C10.1437%2013.2104%2022.3932%204.7843%2024.0457%203.72159C32.6936%20-1.8314%2044.9601%20-1.36515%2058.5655%206.42248C84.7636%2021.4139%20106%2057.878%20106%2087.865Z'%20fill='url(%23paint0_linear_2_1188)'/%3e%3cpath%20d='M94.8649%2095.43C94.8649%20125.417%2073.6284%20137.573%2047.4303%20122.578C21.2322%20107.582%200%2071.1178%200%2041.1308C0%2011.1438%2021.2364%20-1.00811%2047.4345%2013.9833C73.6284%2028.9789%2094.8649%2065.443%2094.8649%2095.43Z'%20fill='url(%23paint1_linear_2_1188)'/%3e%3cpath%20d='M76.9509%20119.128C93.3333%20109.751%2093.3338%2079.3473%2076.9519%2051.2195C60.5701%2023.0917%2034.0094%207.89102%2017.627%2017.2678C1.24456%2026.6446%201.2441%2057.0481%2017.6259%2085.1759C34.0078%20113.304%2060.5685%20128.504%2076.9509%20119.128Z'%20stroke='%2384E4A4'%20stroke-width='0.6873'%20stroke-miterlimit='10'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_2_1188'%20x1='166.254'%20y1='28.7716'%20x2='55.8176'%20y2='64.1084'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.0873'%20stop-color='%2384E4A4'/%3e%3cstop%20offset='0.9709'%20stop-color='%233C53D7'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_2_1188'%20x1='45.5899'%20y1='22.1576'%20x2='3.18783'%20y2='106.806'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.0873'%20stop-color='%2384E4A4'/%3e%3cstop%20offset='0.9709'%20stop-color='%233C53D7'/%3e%3c/linearGradient%3e%3cclipPath%20id='clip0_2_1188'%3e%3crect%20width='106'%20height='129'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e" alt="coin" />
                        </div>
                        <div className="bg-blur-right">
                            <div className="countdown">
                                <h2>Pre-Sale ends in</h2>
                                <h1>{getRemainingTime(countdown)}</h1>
                                <div className="socials mt-5">
                                    <a href='https://web.telegram.org/'><img src={tel_ico} alt="telegram" /></a>
                                    <a href='https://discord.com/'><img src={dis_ico} alt="discord" /></a>
                                    <a href='https://twitter.com/'><img src={twi_ico} alt="twitter" /></a>
                                    <a href='https://medium.com/'><img src={o_ico} alt="medium" /></a>
                                    <a href='https://www.reddit.com/?rdt=49993'><img src={i_ico} alt="reddit" /></a>
                                    <a href='https://www.linkedin.com/'><img src={lin_ico} alt="linkedin" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`responsive-header ${ResponsiveModal === true ? 'open' : ''}`}>
                    <button className="mt-0" onClick={() => setResponsiveModal(false)} style={{ borderRadius: '50px', position: 'absolute', right: '32px', zIndex: '1000', top: '36px' }}>
                        <svg aria-hidden="true" fill="none" height="13" viewBox="0 0 10 10" width="13" xmlns="http://www.w3.org/2000/svg"><title>Close</title><path d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z" fill="#fff"></path></svg></button>
                    <button
                        onClick={() => setResponsiveModal(false)}><Link style={{ textDecorationLine: 'none', color: 'white' }} to={'/all-blogs'}>Create Blog</Link></button>
                    <button><ScrollLink to="affiliate"
                        onClick={() => setResponsiveModal(false)}
                        smooth={true}  // Enable smooth scrolling
                        duration={500} // Duration of the scroll (in ms)
                        style={{ textDecorationLine: 'none', color: 'white' }}>Affiliate Program</ScrollLink></button>
                    <button><ScrollLink to="roadmap"
                        onClick={() => setResponsiveModal(false)}
                        smooth={true}  // Enable smooth scrolling
                        duration={500} // Duration of the scroll (in ms)
                        style={{ textDecorationLine: 'none', color: 'white' }}>Road Map</ScrollLink></button>
                    <button><ScrollLink to="token"
                        onClick={() => setResponsiveModal(false)}
                        smooth={true}  // Enable smooth scrolling
                        duration={500} // Duration of the scroll (in ms)
                        style={{ textDecorationLine: 'none', color: 'white' }}>Token Distribution</ScrollLink></button>
                    <button><ScrollLink to="blog"
                        onClick={() => setResponsiveModal(false)}
                        smooth={true}  // Enable smooth scrolling
                        duration={500} // Duration of the scroll (in ms)
                        style={{ textDecorationLine: 'none', color: 'white' }}>Blogs</ScrollLink></button>
                    <button><ScrollLink to="faq"
                        onClick={() => setResponsiveModal(false)}
                        smooth={true}  // Enable smooth scrolling
                        duration={500} // Duration of the scroll (in ms)
                        style={{ textDecorationLine: 'none', color: 'white' }}>Faqs</ScrollLink></button>
                </div>
            </div >
            <div className="video-container" style={{ position: 'relative' }} ref={videoRef}>
                {!isVideoPlaying ? (
                    <div className="bg-image">
                        <div className="play-button" onClick={() => setIsVideoPlaying(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 194 194" fill="none">
                                <path
                                    d="M194 97C194 150.572 150.572 194 97 194C43.4284 194 0 150.572 0 97C0 43.4284 43.4284 0 97 0C150.572 0 194 43.4284 194 97Z"
                                    fill="#F57D6F"
                                />
                                <path d="M84 77L120 97.5L84 118V77Z" fill="white" />
                            </svg>
                            <span>Video Presentation</span>
                        </div>
                    </div>
                ) : (
                    <div className="video-player d-flex align-items-center justify-content-center">
                        {isLoading && (
                            <div className="bg-image">
                                <div className="loader m-auto" style={{ position: 'absolute', top: '45%', left: '50%' }}>
                                    <div className="spinner"></div>
                                </div>
                            </div>
                        )}
                        <iframe
                            src="https://player.vimeo.com/video/44309170?autoplay=1" // Autoplay video when iframe loads
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title="Video Presentation"
                            onLoad={handleVideoLoad} // Hide loader when video is fully loaded
                        ></iframe>
                    </div>
                )}
            </div>
            <div className="container-afflit" id="affiliate">
                <h2 className="h" style={{ color: '#fff', textAlign: 'center', marginBottom: '50px', fontSize: '34px' }}>Affiliate Program</h2>
                <div className="container">
                    <div className="roadmap-header w-100 text-center" style={{ marginBottom: '65px' }}>
                        <h2 className="map-head" style={{ color: '#0094ff', fontSize: '17px' }}>How it works</h2>
                        <h1 className="map-main-head text-center" >Simple Steps to Cashback <br /> Rewards
                        </h1>
                    </div>
                    <div className="container-affli">
                        <div className="left">
                            <div className="car d-flex">
                                <img src="https://blockdag.network/icons/referral-link.svg" style={{ width: 'calc(min(1px, 0.06944vw)*48)' }} height={'auto'} alt="" />
                                <div className="info">
                                    <h2>1. Use your affiliate link to <br /> get started.</h2>
                                    <p>Every user will receive a unique Affiliate code upon connecting their wallet.</p>
                                </div>
                            </div>
                            <div className="car d-flex">
                                <img src="https://blockdag.network/icons/affiliate-system.svg" style={{ width: 'calc(min(1px, 0.06944vw)*48)' }} height={'auto'} alt="" />
                                <div className="info">
                                    <h2>2. Affiliate Program Works For <br /> You Perfectly</h2>
                                    <p>Share it with your friends and community!</p>
                                </div>
                            </div>
                            <div className="car d-flex">
                                <img src="https://blockdag.network/icons/tether.svg" style={{ width: 'calc(min(1px, 0.06944vw)*48)' }} height={'auto'} alt="" />
                                <div className="info">
                                    <h2>3. Start Earning USDT Immediately</h2>
                                    <p>Earn USDT BEP-20 cashback for every <br /> purchase made by your links. You'll receive 5% <br /> cashback instantly!</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <img src="https://blockdag.network/images/referral-steps.webp" alt="image" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="refferal-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12 pt-4">
                            <div className="referral-section w-100" style={{ marginTop: '80px', paddingLeft: '140px' }}>
                                <h2 style={{ fontSize: '25px' }}>Share Your Referral Link</h2>
                                <p className="mt-4" style={{ color: '#c1cade', fontSize: '14px', paddingRight: '130px' }}>Copy and share your referral link to start earning rewards. The more people you refer, the more you earn!</p>
                                <div className="referral-link" style={{ marginTop: '40px' }}>
                                    <input
                                        style={{ fontWeight: '600' }}
                                        type="text"
                                        value={`https://gittu-ebon.vercel.app/referral?user=286254`}
                                        readOnly
                                    />
                                    <button onClick={handleCopyReferralLink} style={{ background: '#030D43' }}>Copy</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <img className="refi" src={referal_img} style={{ width: '500px', height: '400px', marginLeft: '20px' }} alt="referal=img" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="roadmap-container" id="roadmap" style={{ padding: '140px 0' }}>
                <div className="roadmap-content">
                    <div className="roadmap-header">
                        <h2 className="map-head">Our Special Way</h2>
                        <h1 className="map-main-head">Crypterium Road Map</h1>
                    </div>
                    <div className="timeline" style={{ marginTop: '110px' }}>
                        <div className="d-flex align-items-center mb-2" style={{ gap: '100px' }}>
                            <div className="label">June 2017</div>
                            <div className="label" style={{ marginLeft: '9px' }}>July 2017</div>
                            <div className="label">December 2017</div>
                            <div className="label" style={{ marginLeft: '-25px' }}>December 2017</div>
                            <div className="label" style={{ marginLeft: '-18px' }}>January 2018</div>
                            <div className="label" style={{ marginLeft: '-5px' }}>January 2018</div>
                            <div className="label" style={{ marginLeft: '-0px' }}>April 2018</div>
                        </div>

                        <img style={{ marginBottom: '-34px' }} src={map_bar} alt="" />

                        <div className="d-flex align-items-center mb-2" style={{ gap: '100px' }}>
                            <div className="label" style={{ marginLeft: '-25px', width: '100px', fontSize: '15px', fontWeight: '500' }}>Stats Center Beta</div>
                            <div className="label" style={{ marginLeft: '-30px', width: '100px', fontSize: '15px', fontWeight: '500' }}>BI Intergration</div>
                            <div className="label" style={{ marginLeft: '-24px', width: '100px', fontSize: '15px', fontWeight: '500' }}>Fantasy Prototype</div>
                            <div className="label" style={{ marginLeft: '-26px', width: '100px', fontSize: '15px', fontWeight: '500' }}>Tokens Crowdsale</div>
                            <div className="label" style={{ marginLeft: '-24px', width: '100px', fontSize: '15px', fontWeight: '500' }}>Blogging Platform</div>
                            <div className="label" style={{ marginLeft: '-25px', width: '100px', fontSize: '15px', fontWeight: '500' }}>Blogging Platform</div>
                            <div className="label" style={{ marginLeft: '-22px', width: '100px', fontSize: '14px', fontWeight: '500' }}>Fantasy Sports with SCR</div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="token-distribution-container" id="token">
                <div className="heading">
                    <h2 className="map-head" style={{ color: '#000' }}>Our Data</h2>
                    <h1 className="map-main-head" style={{ color: '#000' }}>Token Distribution</h1>
                </div>
                <div className="chart-container">
                    <div className="description pl-4">
                        <p className="one">Spend real fights effective anything extra by leading. Mouthwatering leading how real</p>
                        <p className="two">Coolie loach African lungfish Redfin perch flying characin alooh armorhead pelagic cod moonfish candiru Oriental loach spikefish tang boafish peacock flounder</p>
                    </div>
                    <div className="chart__wrap p-0" style={{ width: '700px', height: '600px', margin: '-90px 0' }}>
                        {/* Chart */}
                        <Doughnut style={{ width: '700px', height: '600px' }} data={data} options={options} />
                    </div>
                </div>

            </div>
            <div className="slider-container container" id="blog" style={{ position: 'relative', height: blogPosts.length !== 0 ? 'auto' : '100vh' }}>
                <div className="heading" style={{ margin: '50px 0 80px 0' }}>
                    <h1 className="map-main-head" style={{ color: '#000' }}>Latest News & Blog</h1>
                </div>
                {blogPosts.length !== 0 ? <Slider {...settings}>
                    {blogPosts.map((post, index) => (
                        <div key={index} className="slider-item">
                            <div className="image-w">
                                <img src={post.image} alt={post.title} />
                            </div>
                            <div className="post-info">
                                <h3>{post.subHeading}</h3>
                                <h4 style={{ color: '#000' }}><Link to={`/view-blog/${post._id}`} style={{ color: 'inherit', textDecorationLine: 'none' }}>{post.title}</Link> </h4>
                                <p style={{ color: '#000' }}>{post.description.slice(0, 110) + ' ...'}</p>
                                <small style={{ color: '#000' }}>{post.date}</small>
                            </div>
                        </div>
                    ))}
                </Slider> : <div className="loader m-auto" style={{ position: 'absolute', top: '45%', left: '50%' }}>
                    <div className="spinner" style={{ color: '#000' }}></div>
                </div>}
            </div>
            <div className="faq-container text-center container" id="faq">
                <div className="heading" style={{ margin: '0px 0 60px 0' }}>
                    <h1 className="map-main-head" style={{ color: '#000' }}>Have any questions?</h1>
                </div>
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div
                                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleAnswer(index)}
                            >
                                {faq.question}
                                <span className={`faq-icon `}> {activeIndex === index ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                                    <path d="M5.13397 0.5C5.51887 -0.166667 6.48113 -0.166667 6.86603 0.5L11.1962 8C11.5811 8.66667 11.0999 9.5 10.3301 9.5H1.66987C0.900073 9.5 0.418948 8.66667 0.803848 8L5.13397 0.5Z" fill="white" />
                                </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
                                    <path d="M5.13397 9.5C5.51887 10.1667 6.48113 10.1667 6.86603 9.5L11.1962 2C11.5811 1.33333 11.0999 0.5 10.3301 0.5H1.66987C0.900073 0.5 0.418948 1.33333 0.803848 2L5.13397 9.5Z" fill="#B8B8B8" />
                                </svg>}</span>
                            </div>
                            {activeIndex === index && <div className="faq-answer text-start">{faq.answer}</div>}
                        </div>
                    ))}
                </div>
            </div>
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <img src={Logo} alt="Logo" className="footer-logo-img" />
                            <p>
                                Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for ‘lorem ipsum’ will uncover many websites still in their infancy.
                            </p>
                        </div>
                        <div className="footer-menu">
                            <h3>Main menu</h3>
                            <div className="d-flex align-items-center" style={{ gap: '60px' }}>
                                <ul>
                                    <li><a href="#home">Home</a></li>
                                    <li><a href="#about">About Us</a></li>
                                    <li><a href="#contacts">Contacts</a></li>
                                    <li><a href="#news">News</a></li>
                                </ul>
                                <ul>
                                    <li><a href="#events">Events</a></li>
                                    <li><a href="#wallet">Wallet</a></li>
                                    <li><a href="#faqs">FAQs</a></li>
                                    <li><a href="#support">Support</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-subscribe">
                            <h3>Subscribe</h3>
                            <div className="referral-link py-1" style={{ width: '357px', borderRadius: '50px' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="email-input"
                                    style={{ borderRadius: '50px' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    style={{ borderRadius: '50px', fontSize: '17px' }}
                                    className="py-2"
                                    onClick={handleSubmit}
                                >
                                    Subscribe
                                </button></div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom container">
                    <p>© 2018, Gittu All rights reserved. | <a href="#privacy">Privacy Policy</a> | <a href="#sitemap">Sitemap</a></p>
                </div>
            </footer>
        </>
    )
}

export default Home
