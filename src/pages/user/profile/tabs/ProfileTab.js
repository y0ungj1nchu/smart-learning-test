import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";
import basicUser from "../../../../assets/basicUser.png";

function ProfileTab({ onNavigatePassword }) {
  const [nickname, setNickname] = useState("사과");
  const [profileImg, setProfileImg] = useState(basicUser);

  // localStorage 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    const savedImg = localStorage.getItem("profileImg");
    if (savedNickname) setNickname(savedNickname);
    if (savedImg) setProfileImg(savedImg);
  }, []);

  const handleNicknameChange = () => {
    localStorage.setItem("nickname", nickname);
    alert("닉네임이 변경되었습니다");
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

        {/* 레벨 표시 */}
        <div className="profile-level">
          <p>
            <strong>레벨</strong> Lv.10
          </p>
          <div className="level-bar">
            <div className="level-fill" style={{ width: "45%" }}></div>
          </div>
        </div>

        {/* 아이디 / 비밀번호 */}
        <div className="profile-info">
          <div className="info-row">
            <label>아이디</label>
            <input type="text" value="testuser" readOnly />
          </div>

          <div className="info-row">
            <label>현재 비밀번호</label>
            <input type="password" value="***********" readOnly />
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
