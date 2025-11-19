import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";
import basicUser from "../../../../assets/basicUser.png";

import { getMyProfile, updateNickname } from "../../../../utils/api";

function ProfileTab({ onNavigatePassword }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [profileImg, setProfileImg] = useState(basicUser);

  useEffect(() => {
    const savedImg = localStorage.getItem("profileImg");
    if (savedImg) setProfileImg(savedImg);

    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setNickname(data.nickname);
        setEmail(data.email);
        setLevel(data.level);
        setExp(data.exp);
      } catch (error) {
        alert(error.message || "프로필 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchProfile();
  }, []);

  const handleNicknameChange = async () => {
    try {
      const data = await updateNickname(nickname);
      alert(data.message || "닉네임이 변경되었습니다.");
    } catch (error) {
      alert(error.message || "닉네임 변경에 실패했습니다.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
        localStorage.setItem("profileImg", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const maxExp = level * 100;
  const expPercent = (exp / maxExp) * 100;

  return (
    <div className="tab-inner profile-main">
      <div className="profile-box">
        
        {/* 프로필 이미지 + 닉네임 */}
        <div className="profile-header">
          <div className="profile-photo">
            <img src={profileImg} alt="profile" />
          </div>
          <div className="profile-nickname">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <div className="nickname-btns">
              <label htmlFor="imgUpload" className="small-btn gray">
                사진변경
              </label>
              <input
                type="file"
                id="imgUpload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <button className="small-btn" onClick={handleNicknameChange}>
                닉네임 변경
              </button>
            </div>
          </div>
        </div>

        {/* 레벨 정보 */}
        <div className="profile-level">
          <p>
            <strong>레벨</strong> Lv.{level}
          </p>
          <div className="level-bar">
            <div className="level-fill" style={{ width: `${expPercent}%` }}></div>
          </div>
        </div>

        {/* 이메일 */}
        <div className="profile-info">
          <div className="info-row">
            <label>아이디 (이메일)</label>
            <input type="text" value={email} readOnly />
          </div>
        </div>

        {/* 버튼 */}
        <div className="profile-btns">
          <button className="yellow-btn" onClick={onNavigatePassword}>
            비밀번호 재설정
          </button>
          <button className="gray-btn">취소</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
