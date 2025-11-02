import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";
import basicUser from "../../../../assets/basicUser.png";

// --- 수정된 부분 ---
import { getMyProfile, updateNickname } from "../../../../utils/api";
// ------------------

function ProfileTab({ onNavigatePassword }) {
  // --- 수정된 부분 (상태 세분화) ---
  const [email, setEmail] = useState(""); // 이메일(아이디) 상태
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [profileImg, setProfileImg] = useState(basicUser);
  // -------------------------

  // --- 수정된 부분 (API 호출) ---
  // localStorage 불러오기 -> getMyProfile API 호출로 변경
  useEffect(() => {
    // 프로필 이미지 (백엔드 미구현)는 localStorage 유지
    const savedImg = localStorage.getItem("profileImg");
    if (savedImg) setProfileImg(savedImg);

    // DB에서 사용자 정보 가져오기
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(); // API 호출
        setNickname(data.nickname);
        setEmail(data.email);
        setLevel(data.level);
        setExp(data.exp);
      } catch (error) {
        alert(error.message || "프로필 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchProfile();
  }, []); // 페이지 로드 시 1회 실행

  // 닉네임 변경 API 호출로 수정
  const handleNicknameChange = async () => {
    try {
      const data = await updateNickname(nickname); // API 호출
      alert(data.message || "닉네임이 변경되었습니다.");
    } catch (error) {
      alert(error.message || "닉네임 변경에 실패했습니다.");
    }
  };
  // --------------------------

  const handleImageChange = (e) => {
    // (이 부분은 백엔드 API가 없으므로 localStorage 로직을 유지합니다)
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
  
  // 백엔드 스키마 기반으로 경험치 계산 (characterUtils.js 참고)
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

        {/* --- 수정된 부분 (DB 데이터 연동) --- */}
        <div className="profile-level">
          <p>
            <strong>레벨</strong> Lv.{level}
          </p>
          <div className="level-bar">
            {/* characterUtils.js 로직 적용 */}
            <div className="level-fill" style={{ width: `${expPercent}%` }}></div>
          </div>
        </div>

        {/* 아이디 / 비밀번호 */}
        <div className="profile-info">
          <div className="info-row">
            <label>아이디 (이메일)</label>
            <input type="text" value={email} readOnly />
          </div>
        {/* ------------------------------- */}

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