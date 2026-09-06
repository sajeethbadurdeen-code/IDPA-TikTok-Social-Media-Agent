// Rotating content themes for the academy's TikTok.
// "course-spotlight" is the known-good theme to test with first.
const THEMES = {
  'course-spotlight': {
    label: 'Course Spotlight',
    prompt: 'A clean, modern interior design classroom or studio in Sri Lanka with students learning AutoCAD and SketchUp, black and gold branding accents, professional lighting'
  },
  'before-after': {
    label: 'Before & After',
    prompt: 'Split-scene style: one plain empty room, one beautifully finished interior design fit-out, black and gold overlay text style'
  },
  'student-work': {
    label: 'Student Work Showcase',
    prompt: 'A 3D rendered interior design project, realistic residential living room, warm lighting, professional presentation'
  },
  'trainer-tip': {
    label: 'Trainer Tip',
    prompt: 'A confident interior design trainer explaining a concept at a desk with design boards and a laptop showing SketchUp'
  }
};

function selectTheme(requestedKey) {
  const key = requestedKey && THEMES[requestedKey] ? requestedKey : 'course-spotlight';
  return { key, ...THEMES[key] };
}

module.exports = { selectTheme, THEMES };
