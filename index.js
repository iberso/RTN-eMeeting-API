const user = require('./routes/user');
const meeting = require('./routes/meeting');
const room = require('./routes/room');
const Document = require('./routes/document');
const Notification = require('./utils/notification');
const path = require("path");
const fs = require('fs');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images/users_profile/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const maxFileSize = 1 * 1024 * 1024; //1 MB
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(new Error('Only .png, .jpg, .jpeg format Allowed!'));
        }
    },
    limits: { fileSize: maxFileSize }
}).single('profile_photo');

const portServer = process.env['PORT'];

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

const bodyParser = require('body-parser')
const { json, application } = require("express");
const helper = require('./helper');
const middleware = require('./middleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MulterError } = require('multer');

require('dotenv').config();

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api', async(req, res) => {
    res.status(200).send({ "Status": "success", "message": "Server, Halooooo" });
})

const url_prefix = process.env['URL_PREFIX'];

//User Servicesc
app.get('/api/user', middleware.check_authorization, async(req, res) => {
    let response = await user.get_user(null, req);
    res.status(response.status_code).send(response.body);
})

app.get('/api/users', middleware.check_authorization, async(req, res) => {
    let response = await user.get_all_users();
    res.status(response.status_code).send(response.body);
})

app.post('/api/user/login', middleware.check_login, async(req, res) => {
    let response = await user.login_user(req.body);
    res.status(response.status_code).send(response.body)
})

app.put('/api/user/device_token', middleware.check_authorization, async(req, res) => {
    const response = await user.set_user_device_token(req);
    res.status(response.status_code).send(response.body);
});

app.post('/api/user', async(req, res) => {
    let response = await user.add_user(req.body);
    res.status(response.status_code).send(response.body);
})

app.post('/api/user/logout', middleware.check_authorization, async(req, res) => {
    let response = await user.logout_user(req);
    res.status(response.status_code).send(response.body);
})

app.put('/api/user', middleware.check_authorization, async(req, res) => {
    let response = await user.edit_user(req);
    res.status(response.status_code).send(response.body);
});

app.put('/api/user/reset-password/:token', async(req, res) => {
    let response = await user.change_password(req.params.token, req.body);
    res.status(response.status_code).send(response.body);
})

app.post('/api/user/request-change-password', async(req, res) => {
    let response = await user.request_change_password(req.body);
    res.status(response.status_code).send(response.body);
});

app.put('/api/user/:nik/profile', async(req, res) => {
    upload(req, res, async(err) => {
        if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
            const response = helper.http_response(null, 'error', err.message, 403);
            return res.status(response.status_code).send(response.body);
        }

        // Everything went fine.
        const response_get = await user.get_user_profile(req.params.nik);
        if (response_get.status_code === 200 && response_get.body.data != 'assets/images/user.png') {
            fs.unlinkSync(path.join(__dirname, '/', response_get.body.data));
        }

        const response = await user.edit_user_profile(req.file.path, req.params.nik);
        res.status(response.status_code).send(response.body);
    });

});

app.put('/api/user/:nik/role', async(req, res) => {
    const response = await user.change_user_role(req);
    res.status(response.status_code).send(response.body);
});

app.get("/api/user/:nik/profile", async(req, res) => {
    const response = await user.get_user_profile(req.params.nik);
    if (response.status_code === 200) {
        res.sendFile(path.join(__dirname, '/', response.body.data));
    } else {
        res.status(response.status_code).send(response.body);
    }
});

// Meeting Services

app.get('/api/meeting/:meeting_id', middleware.check_authorization, async(req, res) => {
    let response = await meeting.get_meeting_by_meeting_id(req.params.meeting_id);
    res.status(response.status_code).send(response.body);
});

app.put('/api/meeting/:meeting_id', middleware.check_authorization, async(req, res) => {
    let response = await meeting.edit_meeting(req.body, req.params.meeting_id);
    res.status(response.status_code).send(response.body);
});

app.put('/api/meeting/:meeting_id/approval', middleware.check_authorization, async(req, res) => {
    const response = await Document.approve_document(req.params.meeting_id, req.body.user_id, req.body.approval_status);
    res.status(response.status_code).send(response.body);
});

app.put('/api/meeting/:meeting_id/attendance', middleware.check_authorization, async(req, res) => {
    const response = await meeting.edit_participant_attendance(req.params.meeting_id, req.body.participants, req);
    res.status(response.status_code).send(response.body);
});

app.post('/api/meeting', middleware.check_authorization, async(req, res) => {
    let response = await meeting.add_meeting(req.body);
    res.status(response.status_code).send(response.body);
});

app.get('/api/meeting/user/:nik', middleware.check_authorization, async(req, res) => {
    if (req.query.date) {
        let response = await meeting.get_user_meeting_by_date(req.params.nik, req.query.date);
        res.status(response.status_code).send(response.body);
    } else if (req.query.type) {
        let response = await meeting.get_user_all_meeting_by_type(req.params.nik, req.query.type);
        res.status(response.status_code).send(response.body);
    } else {
        let response = await meeting.get_user_all_meeting(req.params.nik);
        res.status(response.status_code).send(response.body);
    }
});

app.post('/api/meeting/users', middleware.check_authorization, async(req, res) => {
    const response = await meeting.get_all_users(req.body);
    res.status(response.status_code).send(response.body);
});

// Room Services

app.post('/api/room', middleware.check_authorization, async(req, res) => {
    let response = await room.add_room(req.body);
    res.status(response.status_code).send(response.body);
});

app.get('/api/room/:id_room', middleware.check_authorization, async(req, res) => {
    let response = await room.get_room_by_id(req.params.id_room);
    res.status(response.status_code).send(response.body);
});

app.put('/api/room/:id_room', middleware.check_authorization, async(req, res) => {
    let response = await room.edit_room(req.body.room_name, req.params.id_room);
    res.status(response.status_code).send(response.body);
});

app.post('/api/rooms', middleware.check_authorization, async(req, res) => {
    let response = await room.get_all_room_by_status(req.body);
    res.status(response.status_code).send(response.body);
});

//DONE
app.get('/api/rooms', middleware.check_authorization, async(req, res) => {
    let response = await room.get_all_room();
    res.status(response.status_code).send(response.body);
});

// Token Services

//DONE
app.get('/api/check-token', middleware.check_authorization, async(req, res) => {
    let response = await helper.verify_token(req);
    res.status(response.status_code).send(response.body);
})

//DONE
app.get('/api/all-token', async(req, res) => {
    res.status(200).send(helper.get_all_tokens());
})

//DONE
app.get('/api/token-extend', async(req, res) => {
    let response = await helper.extend_token(req);
    res.status(response.status_code).send(response.body);
});

app.get('/api/reset-password-check/:token', async(req, res) => {
    let response = await helper.check_reset_password_token(req.params.token);
    res.status(response.status_code).send(response.body);
});

io.on("connection", function(socket) {
    console.log('===============================')
    console.log("Users Connected : " + socket.id);

    socket.on('get-document', async function(meeting_id) {
        const document_data = await Document.create_or_find_document(meeting_id);

        socket.join(meeting_id)
        socket.emit('load-document', document_data);

        socket.on('send-changes', function(delta) {
            socket.to(meeting_id).emit('receive-changes', delta);

            // socket.broadcast.to(meeting_id).emit('receive-changes', delta);
        });

        socket.on('save-document', async function(data) {
            await Document.update_documents(meeting_id, data);
        });
    });

    socket.on('leave-document', function(meeting_id) {
        socket.leave(meeting_id);
    });

    socket.on('check', function() {
        console.log("My Socket ID : " + socket.id)
        console.log(io.sockets.adapter.rooms)
    });

    socket.on('disconnect', function() {
        console.log("Users disconnected : " + socket.id);
    });
});

// Notification.start_cron_scheduler();

server.listen(portServer, function() {
    console.log(`Rest API listening at ${portServer}`)
});