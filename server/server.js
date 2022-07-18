const express = require('express');
const path = require('path');

const { User, Form } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./config/connection');

const { authMiddleware, signToken } = require('./utils/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("/api/getForms", authMiddleware, async (req, res) => {
    try {
        const forms = await Form.find({ user: req.user._id });
        if (!forms.length > 0) return res.json({ message: "No forms found", code: 404 })
        return res.json({ formData: forms, code: 200 });
    }
    catch {
        return res.json({ message: "You are not logged in", code: 400 })
    }
})

app.get("/api/formInfo/:id", authMiddleware, async (req, res) => {
    try {
        let form = await Form.findOne({ _id: req.params.id });
        if (req.headers.edit === "true") {
            if (`${form.user}` !== req.user._id) return res.json({ message: "You are not authorized to edit this form.", code: 401 });
            return res.json({ form, code: 200 });
        } else {
            const { username } = await User.findOne({ _id: form.user });
            form = await Form.findOne({ _id: req.params.id }).select("-user");
            return res.json({ form: { ...form._doc, username }, code: 200 })
        }
    }
    catch {
        return res.json({ message: "Form couldn't be found", code: 404 })
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.post("/api/signIn", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ message: 'Wrong username or password', code: 400 });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);
    if (!correctPw) {
        return res.json({ message: 'Wrong username or password', code: 400 });
    }
    const token = signToken(user);
    res.json({ token, user, code: 200 });
})

app.post("/api/signUp", async (req, res) => {
    try {
        const user = await User.create(req.body);
        if (!user) {
            res.json({ message: 'Could not create account.', code: 400 });
        }
        const token = signToken(user);
        res.json({ token, user, code: 200 });
    }
    catch {
        return res.json({ message: "Account already exists!", code: 400 })
    }
});

app.post("/api/createForm", authMiddleware, async (req, res) => {
    try {
        const currentTime = Math.round((new Date()).getTime() / 1000);
        const createdForm = await Form.create({
            user: req.user._id,
            name: "New Form",
            lastUpdated: currentTime,
            questions: [
                {
                    name: "New Question",
                    number: 0,
                    hasOther: false,
                    choices: [
                        {
                            name: "New Choice"
                        },
                        {
                            name: "New Choice"
                        },
                        {
                            name: "New Choice"
                        },
                        {
                            name: "New Choice"
                        },
                    ]
                }
            ]
        });
        if (!createdForm) {
            res.json({ message: 'Could not create form.', code: 400 });
        }
        res.json({ formId: createdForm._id, code: 200 });
    }
    catch {

    }
})

app.post("/api/saveForm/:id", authMiddleware, async (req, res) => {
    try {
        req.body.lastUpdated = Math.round((new Date()).getTime() / 1000);
        const oldForm = await Form.findOne({ _id: req.params.id })
        if (`${oldForm.user}` !== req.user._id) return res.json({ message: "You are not authorized to edit this form.", code: 401 });
        const updatedForm = await Form.findOneAndReplace({ _id: req.params.id }, req.body);
        if (oldForm === updatedForm) return req.json({ message: "Could not save form, please try again", code: 500 });
        return res.json({ message: "Successfully saved form", code: 200 })
    }
    catch (error) {
        console.log(error)
        return res.json({ message: "You are not authorized to edit this form.", code: 401 })
    }
})

app.post("/api/deleteForm/:id", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findOne({ _id: req.params.id });
        console.log(form.user === req.user._id)
        if (form.user != req.user._id) return res.json({ message: "You are not authorized to do this action", code: 401 });
        const deletedForm = await Form.findOneAndDelete({ _id: req.params.id });
        return res.json({ message: "Successfully deleted form", code: 200 });
    }
    catch (error) {
        console.log(error)
        return res.json({ message: "You are not authorized to do this action", code: 401 });
    }
})

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});