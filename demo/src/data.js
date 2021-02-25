import nietzsche from './img/nietzsche.jpg'
import dostoevsky from './img/dostoevsky.jpg'
import sartre from './img/sartre.jpg'
import birth from './img/birth.png'
import crime from './img/crime.svg'
import demons from './img/demons.jpg'
import evolution from './img/evolution.png'
import gs from './img/gay-science.jpg'
import humiliated from './img/humiliated.jpg'
import nausea from './img/nausea.png'
import vibes from './img/vibes.png'

export const FAVORITE_BOOKS = [
{
  id: 1,
  name: 'The Birth of Tragedy from the Spirit of Music',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
},
{
  id: 2,
  name: 'Human, All Too Human',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
}, 
{
  id: 3,
  name: 'The Gay Science',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  },
},
{
  id: 4,
  name: 'Thus Spoke Zarathustra',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
},
{
  id: 5,
  name: 'Demons',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
},
{
  id: 6,
  name: 'Crime and Punishment',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
},
{
  id: 7,
  name: 'Humiliated and Insulted',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
}
]

export const AUTHORS = {
  1: {
    id: 1,
    name: 'Friedrich Nietzsche',
    img: nietzsche,
    booksPreview: [
      { 
        id: 1,
        name: 'The Birth of Tragedy from the Spirit of Music',
        description: 'its so good',
      },
      { id: 2,
        name: 'Human, All Too Human',
        description: 'its so good',
      },
      { id: 3,
        name: 'The Gay Science',
        description: 'its so good',
      },
      { id: 4,
        name: 'Thus Spoke Zarathustra',
        description: 'its so good',
      },
    ],
    country: 'Prussia'
  },
  2: {
    id: 2,
    name: 'Fyodor Dostoevsky',
    img: dostoevsky,
    booksPreview: [
      {
        id: 5,
        name: 'Demons',
        description: 'its so good',
      },
      {
        id: 6,
        name: 'Crime and Punishment',
        description: 'its so good',
      },
      {
        id: 7,
        name: 'Humiliated and Insulted',
        description: 'its so good',
      },
    ],
    country: 'Russia'
  },
  3: {
    id: 3,
    name: 'Sartre',
    img: sartre,
    booksPreview: [
      {
        id: 8,
        name: 'Nausea',
        description: 'some of these days'
      }
    ],
    country: 'France'
  }
}

export const BOOKS = {
  1: {
    id: 1,
    name: 'The Birth of Tragedy from the Spirit of Music',
    favorite: true,
    description: 'its so good',
    img: birth,
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  2: {
    id: 2,
    name: 'Human, All Too Human',
    favorite: true,
    description: 'its so good',
    img: evolution,
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  3: {
    id: 3,
    name: 'The Gay Science',
    favorite: true,
    description: 'its so good',
    img: gs,
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  4: {
    id: 4,
    name: 'Thus Spoke Zarathustra',
    favorite: true,
    description: 'its so good',
    img: vibes,
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  5: {
    id: 5,
    name: 'Demons',
    favorite: true,
    description: 'its so good',
    img: demons,
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  6: {
    id: 6,
    name: 'Crime and Punishment',
    favorite: true,
    description: 'its so good',
    img: crime,
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  7: {
    id: 7,
    name: 'Humiliated and Insulted',
    favorite: true,
    description: 'its so good',
    img: humiliated,
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  8: {
    id: 8,
    name: 'Nausea',
    favorite: false,
    description: 'some of these days',
    img: nausea,
    author: {
      id: 3,
      name: 'Sartre'
    }
  },
}
