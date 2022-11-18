const db = require("../config/db");

module.exports = {
  store: (data) => {
    const { id, sender, receiver, chat, chatType, chat_timestamp, date } = data;

    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO chats (id, sender, receiver, chat, chat_type, chat_timestamp, date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [id, sender, receiver, chat, chatType, chat_timestamp, date],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },

  deleteChat: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE chats SET is_deleted=true, chat_timestamp=CURRENT_TIMESTAMP WHERE id=$1",
        [id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),

  updateChat: (id, newMessage) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE chats SET chat=$1 WHERE id=$2",
        [newMessage, id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),

  list: (sender, receiver) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT userSender.username, userSender.photo AS photo, chats.id, chats.chat, chats.is_deleted, chats.chat_timestamp, chats.date, userSender.id AS sender_id, userReceiver.id AS receiver_id FROM chats LEFT JOIN users AS userSender ON chats.sender=userSender.id LEFT JOIN users AS userReceiver ON chats.receiver=userReceiver.id WHERE (sender='${sender}' AND receiver='${receiver}') OR (sender='${receiver}' AND receiver='${sender}') ORDER BY chats.date`,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    }),
};
