exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('q_a').del().then(() => {
    return knex('slides').del().then(() => {
      return knex('results').del().then(() => {
        return knex('polls').del().then(() => {
          return knex('presentation').del().then(() => {
            return knex('users').del().then(() => {
              // Inserts seed entries
              return knex('users').insert([{
                  usersname: 'lucas',
                  //password: '1234'
                  password: '$2b$10$QqMdlv5fuhiIqiTfhjdBwuqdG9vicydgs.o83dTvdvamyb18rc1/u',
                  social_login: JSON.stringify('linkedin'),
                  first_name: 'lu',
                  last_name: 'cas',
                  email: 'lucas@lucas.com',
                  phone: '12345678',
                  company: 'lucas.co'
                },
                {
                  usersname: 'ivan',
                  //password: '1234'
                  password: '$2b$10$QqMdlv5fuhiIqiTfhjdBwuqdG9vicydgs.o83dTvdvamyb18rc1/u',
                  social_login: JSON.stringify('facebook'),
                  first_name: 'i',
                  last_name: 'van',
                  email: 'ivan@ivan.com',
                  phone: '12345678',
                  company: 'ivan.co',
                },
                {
                  usersname: 'didier',
                  password: '$2b$10$QqMdlv5fuhiIqiTfhjdBwuqdG9vicydgs.o83dTvdvamyb18rc1/u',
                  social_login: JSON.stringify('google'),
                  first_name: 'di',
                  last_name: 'dier',
                  email: 'didier@didier.com',
                  phone: '12345678',
                  company: 'didier.co',
                }
              ]);
            }).then(() => {
              return knex('presentation').insert([{
                  id: 1,
                  users_id: 1,
                  title: 'hello world',
                  location: 'Hong Kong',
                  date: '2018/05/12 19:00'
                },
                {
                  id: 2,
                  users_id: 2,
                  title: 'hello world2',
                  location: 'Hong Kong',
                  date: '2018/05/12 19:00'
                },
                {
                  id: 3,
                  users_id: 3,
                  title: 'hello world3',
                  location: 'Hong Kong',
                  date: '2018/05/12 19:00'
                }
              ]);
            }).then(() => {
              return knex('polls').insert([
                // {type: 'bar/pie/doughnut/polarArea', labels: string[], label: "", bgc: string[], bdc: string[], bdw: number}
                {
                  id: 1,
                  polls_question: '1+1 = ?',
                  answers_content: JSON.stringify({
                    A: '1',
                    B: '2',
                    C: '3',
                    D: '4'
                  }),
                  style: JSON.stringify({
                    type: 'bar',
                    labels: ['a', 'b', 'c', 'd'],
                    label: "1+1 = ?",
                    bgc: ['rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)'
                    ],
                    bdc: ['rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    bdw: 2
                  })
                },
                {
                  id: 2,
                  polls_question: 'What is your fav food?',
                  answers_content: JSON.stringify({
                    A: 'Bacon',
                    B: 'Veal',
                    C: "Your mama",
                    D: "Salmon"
                  }),
                  style: JSON.stringify({
                    type: 'doughnut',
                    labels: ['a', 'b', 'c', 'd'],
                    label: "1+1 = ?",
                    bgc: ['rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)'
                    ],
                    bdc: ['rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    bdw: 2
                  })
                },
                {
                  id: 3,
                  polls_question: 'Beautifully-dumb or Hidiously-smart',
                  answers_content: JSON.stringify({
                    A: "Beautifully-dumb",
                    B: "Hidiously-smart"
                  }),
                  style: JSON.stringify({
                    type: 'pie',
                    labels: ['a', 'b'],
                    label: "1+1 = ?",
                    bgc: ['rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)'
                    ],
                    bdc: ['rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)'
                    ],
                    bdw: 2
                  })
                },
                {
                  id: 4,
                  polls_question: 'Best singer',
                  answers_content: JSON.stringify({
                    A: "Kanye West",
                    B: 'Celion Dion',
                    C: "Luciano Pavarotti",
                    D: "You"
                  }),
                  style: JSON.stringify({
                    type: 'polarArea',
                    labels: ['a', 'b', 'c', 'd'],
                    label: "1+1 = ?",
                    bgc: ['rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)'
                    ],
                    bdc: ['rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)'
                    ],
                    bdw: 2
                  })
                }
              ])
            }).then(() => {
              return knex('results').insert([{
                  id: 1,
                  polls_id: 1,
                  answer: 'A',
                  nickname: 'ivan'
                },
                {
                  id: 2,
                  polls_id: 1,
                  answer: 'B',
                  nickname: 'didier'
                },
                {
                  id: 3,
                  polls_id: 1,
                  answer: 'C',
                  nickname: 'lucas'
                },
                {
                  id: 4,
                  polls_id: 1,
                  answer: 'C',
                  nickname: 'Andrew'
                },
                {
                  id: 5,
                  polls_id: 1,
                  answer: 'D',
                  nickname: 'Your mama'
                },
                {
                  id: 6,
                  polls_id: 1,
                  answer: 'D',
                  nickname: 'Michael'
                },
                {
                  id: 7,
                  polls_id: 1,
                  answer: 'A',
                  nickname: 'Your mama'
                },
                {
                  id: 8,
                  polls_id: 2,
                  answer: 'A',
                  nickname: 'Alex'
                }
              ]).then(() => {
                return knex('slides').insert([{
                    id: 1,
                    presentation_id: 1,
                    page_type: 'img',
                    order_index: 1,
                    img_url: 'http://localhost:8181/api/images/1/1/dbccdecac45df6db7c489bb8f3d0dddf?types=png',
                    polls_id: null
                  },
                  {
                    id: 2,
                    presentation_id: 1,
                    page_type: 'polls',
                    order_index: 2,
                    img_url: null,
                    polls_id: 1
                  },
                  {
                    id: 3,
                    presentation_id: 1,
                    page_type: 'img',
                    order_index: 3,
                    img_url: 'http://localhost:8181/api/images/1/1/eb01cde43c2e7a19a9802f06d3dd9d01?types=png',
                    polls_id: null
                  },
                  {
                    id: 4,
                    presentation_id: 1,
                    page_type: 'polls',
                    order_index: 4,
                    img_url: null,
                    polls_id: 2
                  },
                  {
                    id: 5,
                    presentation_id: 1,
                    page_type: 'q_a',
                    order_index: 5,
                    img_url: null,
                    polls_id: null
                  }
                ]).then(() => {
                  return knex('q_a').insert([{
                      id: 1,
                      slides_id: 1,
                      q_a_question: 'Ivan?',
                      nickname: 'ivan',
                      likes: 10
                    },
                    {
                      id: 2,
                      slides_id: 1,
                      q_a_question: 'Didier?',
                      nickname: 'didier',
                      likes: 20
                    },
                    {
                      id: 3,
                      slides_id: 1,
                      q_a_question: 'Lucas?',
                      nickname: 'lucas',
                      likes: 30
                    }
                  ]);
                })
              });
            });
          });
        });
      });
    });
  });
};