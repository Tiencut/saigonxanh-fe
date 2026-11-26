import React from 'react';
import { TeamDirectory } from './TeamDirectory';

interface AboutTeamSectionProps {
  teamTab: 'dieuhanh' | 'truyenthong' | 'haucan' | 'codong';
  setTeamTab: (tab: 'dieuhanh' | 'truyenthong' | 'haucan' | 'codong') => void;
}

export const AboutTeamSection: React.FC<AboutTeamSectionProps> = ({ teamTab, setTeamTab }) => {
  return (
    <div className="sgx-page-about">
      <section className="about-intro">
        <div className="section-title-wrap">
          <div className="decor-line" />
          <h2>SAI GON XANH</h2>
        </div>
        <h1>Là một tổ chức môi trường với sứ mệnh ngăn chặn rác thải ra kênh rạch và bờ biển.</h1>
        <p className="lead-text">
          Thành lập ngày 05/12/2022, Sài Gòn Xanh trực thuộc Hội Liên Hiệp Thanh Niên Việt Nam
          TP.HCM với sự tham gia đông đảo của hàng ngàn thanh niên trẻ khắp mọi miền.
        </p>

        <div className="mission-vision-row">
          <div className="mv-box">
            <h3>TẦM NHÌN</h3>
            <p>
              Hướng tới việc biến Việt Nam trở thành quốc gia điển hình trong việc bảo vệ môi
              trường, bắt đầu từ việc cải thiện chất lượng môi trường nước tại Sài Gòn và lan
              toả khắp cả nước.
            </p>
          </div>
          <div className="mv-box">
            <h3>SỨ MỆNH</h3>
            <p>
              Cam kết thu gom rác, tái chế chất thải từ các con sông và nỗ lực thay đổi nhận
              thức cộng đồng về tầm quan trọng của việc bảo vệ môi trường bền vững.
            </p>
          </div>
        </div>
      </section>

      <TeamDirectory teamTab={teamTab} setTeamTab={setTeamTab} />

      {/* Awards Section */}
      <section className="about-awards">
        <h2>THÀNH TÍCH & GIẢI THƯỞNG 2024</h2>
        <div className="awards-grid">
          <div className="award-item">
            <img src="/images/gioithieu/1.png" alt="Start-up Award" />
            <span className="award-year">2024</span>
            <h4>START-UP AWARD</h4>
          </div>
          <div className="award-item">
            <img src="/images/gioithieu/2.png" alt="Thanh niên sống đẹp" />
            <span className="award-year">2024</span>
            <h4>THANH NIÊN SỐNG ĐẸP</h4>
          </div>
          <div className="award-item">
            <img src="/images/gioithieu/3.png" alt="iContent Awards" />
            <span className="award-year">2024</span>
            <h4>VIET NAM ICONTENT AWARDS</h4>
          </div>
          <div className="award-item">
            <img src="/images/gioithieu/5.png" alt="WeChoice Awards" />
            <span className="award-year">2024</span>
            <h4>WE CHOICE AWARDS</h4>
          </div>
        </div>
      </section>
    </div>
  );
};
