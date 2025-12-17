import React, { useState, useEffect } from "react";
import "../../../styles/profile/Tabs.css";
import adminImg from "../../../assets/basicUser.png";

import { getMyProfile, updateNickname } from "../../../utils/api";

function AdminProfileTab({ onNavigatePassword }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");   // ✅ 이메일 상태 추가
  const [profileImg, setProfileImg] = useState(adminImg);

  // 🔥 관리자 기본 정보 로드
  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const user = await getMyProfile(); // /api/user/me

        setNickname(user.nickname || "관리자");
        setEmail(user.email || "관리자 이메일 없음");  // ✅ 이메일 저장
      } catch (err) {
        console.log("관리자 프로필 로드 오류:", err);
      }
    }
    loadAdminProfile();
  }, []);

  // 🔥 닉네임 변경 API 호출
  const handleNicknameChange = async () => {
    try {
      await updateNickname(nickname); // PUT /user/nickname
      alert("관리자 닉네임이 변경되었습니다.");
    } catch (err) {
      console.error("닉네임 변경 오류:", err);
      alert("닉네임 변경 실패");
    }
  };

  // 프로필 이미지(미리보기만)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="tab-inner profile-main">
      <div className="profile-box">

        {/* 프로필 상단 */}
        <div className="profile-header">
          <div className="profile-photo">
            <img src={profileImg} alt="admin" />
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
                id="imgUpload"
                type="file"
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

        {/* 🔥 관리자 이메일 표시 */}
        <div className="profile-info">
          <div className="profile-info-row horizontal">
            <label>Email</label>
            <div>{email}</div>
          </div>
        </div>

        <div className="profile-btns">
          <button className="yellow-btn" onClick={onNavigatePassword}>
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileTab;
