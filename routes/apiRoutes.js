// Post = new entity
// Put  = edit entity

const StringManipulation = require('../tools/stringManipulation');
const path = require('path');

class ApiRouter {
    constructor(imageActions, folderActions, databaseActions) {
        this.folderActions = folderActions;
        this.imageActions = imageActions;
        this.databaseActions = databaseActions;
    }

    router() {
        const router = require("express").Router();

        // [REVIEW] better to put all those callbacks ((req,res) => {}) into instance methods

        /*

        suggested way:

            UserRouter.js
              
                class UserRouter {
                    constructor(......actions) {
                        ....this.xxaction = xxaction;
                    }

                    router() {
                        const router = express.router();
                        router.get('/', this.getUsers.bind(this));
                        router.get('/', this.getUserById);
                        return router;
                    }

                    getUsers(req, res) {
                        res.json([]);
                    }

                    getUserById = (req,res) => {
                        res.json([]);
                    }
                }

            PollRouter.js

            QnaRouter.js

            UserRouter.spec.js

                describe('UserRouter', () => {
                    const userRouter = new UserRouter(.....actions);

                    it('return users', (done) => {
                        userRouter.getUsers({}, {
                            json: (result) => {
                                expect(result).toEqual([]);
                                done();
                            }
                        })
                    })
                })




        */

        router.get("/", (req, res) => {
            res.redirect('/html_mock-up/api/index.html');
        });

        // User operations
        router.get("/users", (req, res) => {
            // if (req.query.requesttype === 'login') {
            //     this.databaseActions.getUserLoginInfo(req.user.id).then((arr) => {
            //         res.json(arr);
            //     }).catch((err) => {
            //         res.status(400).send(err);
            //     })
            // } else if (req.query.requesttype === 'general') {
                this.databaseActions.getUserInfo(req.user.id).then((arr) => {
                    res.json(arr);
                }).catch((err) => {
                    res.status(400).send(err);
                })
            }); 
            // else {
            //     res.status(400).send("Please state which information you need");
            // })
        
        // Lucassss adding new user 
        router.post("/users", (req, res) => {
            this.databaseActions.addNewUser(req.body.usersname, req.body.password).then(() => {
                    // res.json("Hello! you've successfully added a new user ");
                    // [REVIEW] if it is an API call, seldom we do redirection to some HTML pages
                res.redirect('/html_mock-up/desktop/dashboard.html')
                })
                .catch(err => {
                    res.status(500).send(err);
                })
        });
        router.put("/users", (req, res) => {
            // [REVIEW] underscores do not require [''] object syntax
            this.databaseActions.editUserInfo(req.user.id, req.body['first_name'], req.body['last_name'], req.body.email, req.body.phone, req.body.company).then((result, err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);                    
                }
                else {
                    console.log('hi');
                    res.json("Well done, you've successfully edited your user info");
                }
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete("/users/:userid", (req, res) => {
            this.databaseActions.removeUser(req.params.userid).then(() => {
                res.json("We hate to see you go, bye :''\(\(\(\(");
            }).catch((err) => {
                res.status(500).send(err);
            })
        });


        // Presentation operations
        router.get("/presentations/:presentationid", (req, res) => {
            this.databaseActions
                .getPresentationInfo(req.params.presentationid)
                .then((result) => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post("/presentations", (req, res) => {
            this.databaseActions
                .addPresentation(req.body.userId, req.body.title, req.body.location, Date.now())
                .then(() => {
                    // [REVIEW] Consistency is more important
                    res.json("Good job");
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        });
        router.put("/presentations/:presentationid", (req, res) => {
            this.databaseActions
                .editPresentation(req.params.presentationid, req.body.title, req.body.location, Date.now())
                .then(arr => {
                    res.json("Presentation info changed");
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete("/presentations/:presentationid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });


        // Slides operation
        // [REVIEW] Above routes use presentation'i'd but here you use presentation'I'd
        // [REVIEW] suggested route: /presentations/:presentationId/slides
        router.get("/slides/:presentationId", (req, res) => {
            if (req.query.pages) {
                this.databaseActions.getOneSlides(req.params.presentationId, req.query.pages)
                    .then((arr) => {
                        res.json(arr);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            } else {
                this.databaseActions
                    .getAllSlides(req.params.presentationId)
                    .then((arr) => {
                        res.json(arr);
                    })
                    .catch(err => {
                        res.status(500).send(err);
                    });
            }
        });


        // [REVIEW] suggested route: /presentations/:presentationId/slides
        router.post("/slides", (req, res) => {
            this.databaseActions
                .addSlides(req.body.presentation_id, req.body.page_type, req.body.order)
                .then((arr) => {
                    res.json(arr);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.put("/slides/:slideid", (req, res) => {
            this.databaseActions
                .editSlides(req.params.slideid, req.body.presentation_id, req.body.page_type, req.body.order)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete("/slides/:slideid", (req, res) => {
            this.databaseActions
                .removeSlides(req.params.slideid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // Polls operations
        // [REVIEW] These things can be grouped to PollRouter.js
        router.get("/polls/:pollId", (req, res) => {
            this.databaseActions
                .getPollInfo(req.params.pollId)
                .then((arr) => {
                    res.json(arr);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post("/polls", (req, res) => {
            this.databaseActions
                .addPollsInfo(req.body['polls_question'], req.body.style, req.body['answer_content'])
                .then((pollId) => {
                    res.status(200).json();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        // FIXME: OMG
        router.put("/polls/:pollid", (req, res) => {
            this.databaseActions
            // [REVIEW] BUGSSSSSSs ------------- vvvvvvvvvvv
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        router.delete("/polls/:pollId", (req, res) => {
            // NOTE: this can run, but have result dependency
            this.databaseActions
                .removePollsInfo(req.params.pollId)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // TODO: shit not done, at all
        //result
        router.get("/result/:resultid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post("/result", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.put("/result/:resultid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete("/result/:resultid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // TODO: shit not done anything yet
        //result
        router.get("/q_a/:q_aid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post("/q_a", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.put("/q_a/:q_aid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete("/q_a/:q_aid", (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // done
        // http://www.ighsg/api/images/123/242/?pages=12
        router.get('/images/:userId/:presentationId/:md5', (req, res) => {

            this.imageActions.readImage(req.params.userId, req.params.presentationId, req.params.md5, req.query.types)
                .then((imageData) => {
                    res.status(200).end(imageData);
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        });
        router.post('/images/:userid/:presentationid', (req, res) => {
            const fileType = req.files.file.name.split('.').pop();
            const md5Code = req.files.file.md5;
            const buffer = req.files.file.data;
            const userId = req.params.userid;
            const presentationId = req.params.presentationid;

            const apiPath = path.join('http://localhost:8181', '/api', '/images', `/${userId}`, `/${presentationId}`, `/${md5Code}?types=${fileType}`)


            this.imageActions.writeImage(userId, presentationId, md5Code, fileType, buffer)
                .then(() => {
                    this.databaseActions.addSlides(presentationId, apiPath)
                        .then(() => {
                            res.send(apiPath);
                        })
                        .catch(err => {
                            res.send(err);
                        })

                })
                .catch((err) => {
                    res.send(err);
                });

        });
        router.delete('/images/:userid/:presentationid/:md5', (req, res) => {
            this.imageActions.removeImage(req.params.userid, req.params.presentationid, req.params.md5, req.query.types)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // TODO: Need to fix this
        // Folder manipulation: User level
        router.get('/folders/:userid', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post('/folders/:userid', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete('/folders/:userid/', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        // Folder manipulation: Presentation Level
        router.get('/folders/:userid/:presentationid', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.post('/folders/:userid/:presentationid', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
        router.delete('/folders/:userid/:presentationid', (req, res) => {
            this.databaseActions
                .removePresentation(req.params.presentationid)
                .then(() => {
                    res.status(200).end();
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });

        return router;
    }
}

module.exports = ApiRouter;