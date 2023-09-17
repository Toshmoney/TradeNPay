/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.{html,js,ejs}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/image/sectimg.png')"
    },
    backgroundImage2:{
      'hero-pattern': "url('/image/sectimage.png')"
    },
    backgroundImage3:{
      'hero-pattern': "url('/image/recimg.png')"
    },
    backgroundImage4:{
      'hero-pattern': "url('/image/recimage.png')"
    },
    backgroundIimage5:{
      'hero-pattern': "url('/image/rectangle.png')"
    },
    backgroundIimage6:{
      'hero-pattern': "url('/image/rectangle1.png')"
    },
    backgroundIimage7:{
      'hero-pattern': "url('/image/rectangle2.png')"
    },
    backgroundImage8:{
      'hero-pattern': "url('/image/herorec.png')"
    }
  }
  },
  plugins: [],
}

