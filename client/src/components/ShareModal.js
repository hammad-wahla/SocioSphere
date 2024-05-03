import React from 'react';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from 'react-share';

const ShareModal = ({ url, theme }) => {
    const shareToInstagram = () => {
        const instagramURL = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;
        window.open(instagramURL, '_blank');
    };

    return (
        <div className="d-flex justify-content-between px-4 py-2" style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
            <FacebookShareButton url={url}>
                <FacebookIcon round={true} size={32} />
            </FacebookShareButton>

            <TwitterShareButton url={url}>
                <TwitterIcon round={true} size={32} />
            </TwitterShareButton>

            <EmailShareButton url={url}>
                <EmailIcon round={true} size={32} />
            </EmailShareButton>

            {/* Instagram Share Button */}
            <button style={{border: "none", background: "none"}} onClick={shareToInstagram}>
                <img src="instagram-icon.png" alt="Instagram Icon" style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }} />
            </button>

            <WhatsappShareButton url={url}>
                <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>

            <TelegramShareButton url={url}>
                <TelegramIcon round={true} size={32} />
            </TelegramShareButton>
        </div>
    );
};

export default ShareModal;
