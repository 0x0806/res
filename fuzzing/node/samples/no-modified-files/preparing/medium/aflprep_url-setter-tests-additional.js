module.exports = {
  'username': [
    {
      'comment': 'Surrogate pair',
      'new_value': '\uD83D\uDE00',
      'expected': {
        'username': '%F0%9F%98%80'
      }
    },
    {
      'comment': 'Unpaired low surrogate 1',
      'new_value': '\uD83D',
      'expected': {
        'username': '%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired low surrogate 2',
      'new_value': '\uD83Dnode',
      'expected': {
        'username': '%EF%BF%BDnode'
      }
    },
    {
      'comment': 'Unpaired high surrogate 1',
      'new_value': '\uDE00',
      'expected': {
        'username': '%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired high surrogate 2',
      'new_value': '\uDE00node',
      'expected': {
        'username': '%EF%BF%BDnode'
      }
    }
  ],
  'password': [
    {
      'comment': 'Surrogate pair',
      'new_value': '\uD83D\uDE00',
      'expected': {
        'password': '%F0%9F%98%80'
      }
    },
    {
      'comment': 'Unpaired low surrogate 1',
      'new_value': '\uD83D',
      'expected': {
        'password': '%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired low surrogate 2',
      'new_value': '\uD83Dnode',
      'expected': {
        'password': '%EF%BF%BDnode'
      }
    },
    {
      'comment': 'Unpaired high surrogate 1',
      'new_value': '\uDE00',
      'expected': {
        'password': '%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired high surrogate 2',
      'new_value': '\uDE00node',
      'expected': {
        'password': '%EF%BF%BDnode'
      }
    }
  ],
  'pathname': [
    {
      'comment': 'Surrogate pair',
      'expected': {
      }
    },
    {
      'comment': 'Unpaired low surrogate 1',
      'expected': {
      }
    },
    {
      'comment': 'Unpaired low surrogate 2',
      'expected': {
      }
    },
    {
      'comment': 'Unpaired high surrogate 1',
      'expected': {
      }
    },
    {
      'comment': 'Unpaired high surrogate 2',
      'expected': {
      }
    }
  ],
  'search': [
    {
      'comment': 'Surrogate pair',
      'new_value': '\uD83D\uDE00',
      'expected': {
        'search': '?%F0%9F%98%80'
      }
    },
    {
      'comment': 'Unpaired low surrogate 1',
      'new_value': '\uD83D',
      'expected': {
        'search': '?%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired low surrogate 2',
      'new_value': '\uD83Dnode',
      'expected': {
        'search': '?%EF%BF%BDnode'
      }
    },
    {
      'comment': 'Unpaired high surrogate 1',
      'new_value': '\uDE00',
      'expected': {
        'search': '?%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired high surrogate 2',
      'new_value': '\uDE00node',
      'expected': {
        'search': '?%EF%BF%BDnode'
      }
    }
  ],
  'hash': [
    {
      'comment': 'Surrogate pair',
      'new_value': '\uD83D\uDE00',
      'expected': {
        'hash': '#%F0%9F%98%80'
      }
    },
    {
      'comment': 'Unpaired low surrogate 1',
      'new_value': '\uD83D',
      'expected': {
        'hash': '#%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired low surrogate 2',
      'new_value': '\uD83Dnode',
      'expected': {
        'hash': '#%EF%BF%BDnode'
      }
    },
    {
      'comment': 'Unpaired high surrogate 1',
      'new_value': '\uDE00',
      'expected': {
        'hash': '#%EF%BF%BD'
      }
    },
    {
      'comment': 'Unpaired high surrogate 2',
      'new_value': '\uDE00node',
      'expected': {
        'hash': '#%EF%BF%BDnode'
      }
    }
  ]
};
