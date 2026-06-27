/**
 * MoCA question content — sourced from vietnamesemoca_1.pdf (MoCA v2010, Vietnamese).
 * Set-driven sections: naming, memory, sentences, fluency, abstraction.
 */

export const QUESTION_BANK = {
  MOCA_SET_1: {
    set_id: 'MOCA_SET_1',
    label: 'Đề MoCA 1',
    source: 'vietnamesemoca_1.pdf',
    naming: [
      { id: 'n1', image: '/moca/animals/lion.png', answer: 'Sư tử', accept: ['su tu', 'lion'] },
      { id: 'n2', image: '/moca/animals/rhino.png', answer: 'Tê giác', accept: ['te giac', 'rhino', 'rhinoceros'] },
      { id: 'n3', image: '/moca/animals/camel.png', answer: 'Lạc đà', accept: ['lac da', 'camel'] },
    ],
    memory_words: [
      { word: 'Vẻ mặt', cue: 'Đây là một bộ phận trên cơ thể' },
      { word: 'Vải nhung', cue: 'Đây là một loại vải' },
      { word: 'Nhà thờ', cue: 'Đây là một loại công trình kiến trúc' },
      { word: 'Hoa cúc', cue: 'Đây là một loại hoa' },
      { word: 'Màu đỏ', cue: 'Đây là một màu sắc' },
    ],
    sentences: [
      'Tôi chỉ biết rằng Nam là người cần được giúp đỡ hôm nay',
      'Con mèo hay trốn dưới đi văng khi con chó ở trong phòng',
    ],
    fluency: { letter: 'L', threshold: 11 },
    abstraction: {
      example: { pair: 'Quả chuối – Quả cam', answer: 'Hoa quả (trái cây)' },
      pairs: [
        {
          pair: 'Tàu – Xe đạp',
          accept: ['phuong tien', 'giao thong', 'di chuyen', 'di lai', 'vehicle', 'transport'],
        },
        {
          pair: 'Đồng hồ – Thước kẻ',
          accept: ['dung cu do', 'do luong', 'cong cu do', 'measuring', 'instrument'],
        },
      ],
    },
  },
}

/** Fixed across all sets — digits / vigilance / serial-7 from official form. */
export const ATTENTION = {
  digitsForward: [2, 1, 8, 5, 4],
  digitsBackwardRead: [7, 4, 2],
  letterStream: 'EBACMNAAIKLBAEAKDEAAAIAMOEAAB'.split(''),
  targetLetter: 'A',
  serial7: [93, 86, 79, 72, 65],
}

export function pickRandomSetId() {
  const ids = Object.keys(QUESTION_BANK)
  return ids[Math.floor(Math.random() * ids.length)]
}
