class DatabaseActions {
    constructor(knex) {
        this.knex = knex;
    }
    getUserLoginInfo(userId) {
        const user = this.knex("users")
            .select('usersname', 'password', 'social_login')
            .where("id", userId);
        return user;
    }
    getUserInfo(userId) {
        const user = this.knex("users")
            .select('first_name', 'last_name', 'email', 'phone', 'company')
            .where("id", userId);
        return user;
    }
    addNewUser(usersname, password) {
        const user = this.knex("users")
            .insert({
                usersname: usersname,
                password: password
            })
        return user;
    }
    editUserInfo(userId, ftname, ltname, email, phone, company) {
        const user = this.knex("users")
            .update({
                first_name: ftname,
                last_name: ltname,
                email: email,
                phone: phone,
                company: company
            })
            .where("id", userId);
        return user;
    }
    removeUser(userId) {
        const user = this.knex("users")
            .where("id", userId)
            .delete();
        return user;
    }


    // Presentation
    getPresentationInfo(id) {
        const presentation = this.knex("presentation")
            .select()
            .where("id", id);
        return presentation;
    }

    addPresentation(id, title, loc, date) {
        const presentation = this.knex("presentation")
            .insert({
                users_id: id,
                title: title,
                location: loc,
                date: date
            });
        return presentation;
    }

    editPresentation(id, title, loc, date) {
        const presentation = this.knex("presentation")
            .update({
                title: title,
                location: loc,
                date: date
            })
            .where("id", id);
        return presentation;
    }

    removePresentation(id) {
        const presentation = this.knex("presentation")
            .where("id", id)
            .delete();
        return presentation;
    }


    // TODO: check to see what the page is about
    // Slides
    getAllSlides(presentationId) {
        const allSlides = this.knex('slides')
            .select()
            .where('presentation_id', presentationId);
        return allSlides;
    };

    getOneSlides(presentationId, pageNum) {
        const oneSlide = this.knex('slides')
            .select()
            .where({
                'presentation_id': presentationId,
                'order_index': pageNum
            });
        return oneSlide;
    }

    addSlides(id, url) {
        const slide = this.knex('slides')
            .insert({
                presentation_id: id,
                page_type: 'img',
                img_url: url
            });
        return slide;
    };

    editSlides(slideId, id, type, order) {
        const slide = this.knex('pages')
            .update({
                presentation_id: id,
                page_type: type,
                order: order
            })
            .where('id', slideId);
        return slide;
    };
    removeSlides(id) {
        const slide = this.knex('pages')
            .where('id', id)
            .delete();
        return slide;
    };

    // Polls
    getPollInfo(pollId) {
        const poll = this.knex('polls')
            .select()
            .where('id', pollId);
        return poll;
    };

    // FIXME: Need Michale's help to clarify how to return the value after one and another
    addPollsInfo(question, style, answerContent) {
        const poll = this.knex('polls')
            .insert({
                polls_question: question,
                answer_content: JSON.stringify(answerContent),
                style: JSON.stringify(style)
            });

        const id = this.knex('polls').select('id').where("polls_question", question);
        return poll;
    };
    //FIXME: all that is needed to be replaced or changed.
    editPolls(req, res) {
        const poll = this.knex('polls')
            .update({
                pages_id: req.body.pages_id,
                question: req.body.question,
                answer_content: JSON.stringify(req.body[answer_content]),
                style: JSON.stringify(req.body[style])
            })
            .where('id', req.params.pollid)
            .then((arr) => {
                console.log(`edited`);
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };
    //FIXME: all that is needed to be replaced or changed.
    removePollsInfo(pollId) {
        // [REVIEW] delete all its votes as well OR add another "removePollsInfoForce(pollId)"
        return this.knex('polls')
            .where('id', pollId)
            .delete();
        // return poll;
    };

    getPollResults(req, res) {
        const poll = this.knex('result')
            .select()
            .where('id', req.params.resultid)
            .then((arr) => {
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };
    addPollResults(req, res) {
        const poll = this.knex('result')
            .insert({
                polls_id: req.body.polls_id,
                answer: req.body.answer,
                visiter_name: req.body.visiter_name
            })
            .then((arr) => {
                console.log(`added`);
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };
    editPollResults(req, res) {
        const poll = this.knex('result')
            .update({
                polls_id: req.body.polls_id,
                answer: req.body.answer,
                visiter_name: req.body.visiter_name
            })
            .where('id', req.params.resultid)
            .then((arr) => {
                console.log(`edited`);
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };


    // Q&A Result only get ALL result and add 1 
    getQandAResults(req, res) {
        const poll = this.knex('q_a')
            .select()
            .where('id', req.params.q_aid)
            .then((arr) => {
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };
    addQandAResults(req, res) {
        const poll = this.knex('q_a')
            .insert({
                presentation_id: req.body.presentation_id,
                question: req.body.question,
                visiter_name: req.body.visiter_name,
                likes: req.body.likes
            })
            .then((arr) => {
                console.log(`added`);
                res.json(arr);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    };


}

// class LoginOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// class UserOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }
// }

// class PresentationOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// class SlidesOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// class PollsOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// class PollResultsOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// class QandAOperation extends DatabaseActions {
//     constructor() {
//         super();
//     }

// }

// module.exports = {
//     DatabaseAction,
//     LoginOperation,
//     UserOperation,
//     PresentationOperation,
//     SlidesOperation,
//     PollResultsOperation,
//     PollsOperation,
//     QandAOperation
// };

module.exports = DatabaseActions;