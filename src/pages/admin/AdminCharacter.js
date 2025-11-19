import React, { useState } from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/AdminCharacter.css";

import snoopy1 from "../../assets/snoopy1.png";
import snoopy2 from "../../assets/snoopy2.png";
import snoopy3 from "../../assets/snoopy3.png";
import snoopy4 from "../../assets/snoopy4.png";
import snoopy5 from "../../assets/snoopy5.png";

export default function AdminCharacter() {
  const [characters, setCharacters] = useState([
    { id: 1, name: "스누피1", level: 1, image: snoopy1 },
    { id: 2, name: "스누피2", level: 2, image: snoopy2 },
    { id: 3, name: "스누피3", level: 3, image: snoopy3 },
    { id: 4, name: "스누피4", level: 4, image: snoopy4 },
    { id: 5, name: "스누피5", level: 5, image: snoopy5 },
  ]);

  const [newChar, setNewChar] = useState({
    name: "",
    level: "",
    image: null,
    preview: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("image")) {
      setNewChar({
        ...newChar,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleAddCharacter = (e) => {
    e.preventDefault();
    if (!newChar.name || !newChar.level || !newChar.image) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const newCharacter = {
      id: Date.now(),
      name: newChar.name,
      level: parseInt(newChar.level),
      image: newChar.preview,
    };

    setCharacters([...characters, newCharacter]);
    setNewChar({ name: "", level: "", image: null, preview: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setCharacters(characters.filter((c) => c.id !== id));
    }
  };

  return (
    <>
      <div className="adminChar-page">
        <div className="admin-header-fixed">
          <AdminHeader1 isLoggedIn={true} />
          <AdminHeader2 isLoggedIn={true} />
        </div>

        <div className="adminChar-layout">
          <div className="adminChar-list-box">
            <h2 className="adminChar-title">등록된 캐릭터</h2>

            {characters.length === 0 ? (
              <p className="adminChar-empty">등록된 캐릭터가 없습니다.</p>
            ) : (
              <div className="adminChar-list">
                {characters.map((char) => (
                  <div key={char.id} className="adminChar-card">
                    <img src={char.image} alt={char.name} className="adminChar-img" />
                    <div className="adminChar-info">
                      <h4>{char.name}</h4>
                      <p>Lv. {char.level}</p>
                    </div>
                    <button
                      className="adminChar-delete"
                      onClick={() => handleDelete(char.id)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="adminChar-add-box">
            <h2 className="adminChar-title">새 캐릭터 추가</h2>

            <form onSubmit={handleAddCharacter} className="adminChar-form">
              <label>
                캐릭터 이름
                <input
                  type="text"
                  value={newChar.name}
                  onChange={(e) =>
                    setNewChar({ ...newChar, name: e.target.value })
                  }
                  placeholder="예: 스누피6"
                />
              </label>

              <label>
                등장 레벨
                <input
                  type="number"
                  value={newChar.level}
                  onChange={(e) =>
                    setNewChar({ ...newChar, level: e.target.value })
                  }
                  placeholder="숫자 입력"
                  min="1"
                />
              </label>

              <label>
                캐릭터 이미지 (PNG)
                <input type="file" accept="image/png" onChange={handleImageUpload} />
              </label>

              {newChar.preview && (
                <div className="adminChar-preview">
                  <img src={newChar.preview} alt="미리보기" />
                </div>
              )}

              <button type="submit" className="adminChar-add-btn">
                등록하기
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
