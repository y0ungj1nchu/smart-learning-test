// 원본 데이터
const rankingData = [
    { nickname: "ㅇㅇㅇ", level: 34 },
    { nickname: "ㅁㅁㅁ", level: 30 },
    { nickname: "☆☆☆", level: 29 },
    { nickname: "◇◇◇", level: 29 },
    { nickname: "△△△", level: 27 },
];

// 레벨 높은 순으로 정렬된 배열 생성
export const sortedRanking = [...rankingData].sort((a, b) => b.level - a.level);

export default rankingData;