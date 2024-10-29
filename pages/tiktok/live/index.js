import isAdmin from "~/middleware/is-admin";
import $ from "jquery";
import io from 'socket.io-client';

class TikTokIOConnection {
  constructor(backendUrl) {
    this.socket = io(backendUrl);
    this.uniqueId = null;
    this.options = null;

    this.socket.on('connect', () => {
      console.info("Socket connected!");

      // Reconnect to streamer if uniqueId already set
      if (this.uniqueId) {
        this.setUniqueId();
      }
    })

    this.socket.on('disconnect', () => {
      console.warn("Socket disconnected!");
    })

    this.socket.on('streamEnd', () => {
      console.warn("LIVE has ended!");
      this.uniqueId = null;
    })

    this.socket.on('tiktokDisconnected', (errMsg) => {
      console.warn(errMsg);
      if (errMsg && errMsg.includes('LIVE has ended')) {
        this.uniqueId = null;
      }
    });
  }

  connect(uniqueId, options) {
    this.uniqueId = uniqueId;
    this.options = options || {};

    this.setUniqueId();

    return new Promise((resolve, reject) => {
      this.socket.once('tiktokConnected', resolve);
      this.socket.once('tiktokDisconnected', reject);

      setTimeout(() => {
        reject('Connection Timeout');
      }, 15000)
    })
  }

  setUniqueId() {
    this.socket.emit('setUniqueId', this.uniqueId, this.options);
  }

  on(eventName, eventHandler) {
    this.socket.on(eventName, eventHandler);
  }
}

export default {
  layout: "auth-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "TikTok Live",
      loading: false,

      backendUrl: "https://arin.dueraso.com/",
      connection: null,
      viewerCount: 0,
      likeCount: 0,
      diamondsCount: 0,
      joinMsgDelay: 0,
      uniqueId: "https://www.tiktok.com/@useru2lynmd6hk"
    };
  },
  mounted() {
    this.connection = new TikTokIOConnection(this.backendUrl);
    if (!window.settings) window.settings = {};

    // if (window.settings.username)
    //   this.connect();
  },
  methods: {
    async disconnect() {
      this.socket.on('disconnect', () => {
        console.warn("Socket disconnected!");
      })
    },
    async connect() {
      if (this.uniqueId !== "") {
        $("#stateText").text("Connecting...");

        await this.connection.connect(this.uniqueId, {
          enableExtendedGiftInfo: true,
        }).then((state) => {
          $("#stateText").text(`Connected to roomId ${state.roomId}`);
          this.viewerCount = 0;
          this.likeCount = 0;
          this.diamondsCount = 0;
          this.updateRoomStats();
        }).catch((errorMessage) => {
          $("#stateText").text(errorMessage);

          if (window.settings.username) {
            setTimeout(() => {
              this.connect(window.settings.username);
            }, 30000);
          }
        });
      } else {
        alert("no username entered");
      }
    },
    sanitize(text) {
      return text.replace(/</g, "&lt;");
    },
    updateRoomStats() {
      $("#roomStats").html(
        `Viewers: <b>${this.viewerCount.toLocaleString()}</b> Likes: <b>${this.likeCount.toLocaleString()}</b> Earned Diamonds: <b>${this.diamondsCount.toLocaleString()}</b>`
      );
    },
    generateUsernameLink(data) {
      return `<a class="usernamelink" href="https://www.tiktok.com/@${data.uniqueId}" target="_blank">${data.nickname}</a>`;
    },
    isPendingStreak(data) {
      return data.giftType === 1 && !data.repeatEnd;
    },
    addChatItem(color, data, text, summarize) {
      let container = $(".chatcontainer");

      if (container.find("div").length > 500) {
        container.find("div").slice(0, 200).remove();
      }

      container.find(".temporary").remove();

      container.append(`
        <div class=${summarize ? "temporary" : "static"}>
            <img class="miniprofilepicture" style="height: 20px; border-radius: 15px" src="${data.profilePictureUrl}">
            <span>
                <b>${this.generateUsernameLink(data)}:</b>
                <span style="color:${color}">${this.sanitize(text)}</span>
            </span>
        </div>
    `);

      container.stop();
      container.animate(
        {
          scrollTop: container[0].scrollHeight,
        },
        400
      );
    },
    addGiftItem(data) {
      let container = location.href.includes("obs.html") ? $(".eventcontainer") : $(".giftcontainer");

      if (container.find("div").length > 200) {
        container.find("div").slice(0, 100).remove();
      }

      let streakId = data.userId.toString() + "_" + data.giftId;

      let html = `
        <div data-streakid=${this.isPendingStreak(data) ? streakId : ""}>
            <img class="miniprofilepicture" src="${data.profilePictureUrl}">
            <span>
                <b>${this.generateUsernameLink(data)}:</b> <span>${
        data.describe
      }</span><br>
                <div>
                    <table>
                        <tr>
                            <td><img class="gifticon" src="${
        data.giftPictureUrl
      }"></td>
                            <td>
                                <span>Name: <b>${data.giftName}</b> (ID:${
        data.giftId
      })<span><br>
                                <span>Repeat: <b style="${
        this.isPendingStreak(data)
          ? "color:red"
          : ""
      }">x${data.repeatCount.toLocaleString()}</b><span><br>
                                <span>Cost: <b>${(
        data.diamondCount * data.repeatCount
      ).toLocaleString()} Diamonds</b><span>
                            </td>
                        </tr>
                    </table>
                </div>
            </span>
        </div>
    `;

      let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

      if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
      } else {
        container.append(html);
      }

      container.stop();
      console.log(container)
      container.animate(
        {
          scrollTop: container[0].scrollHeight,
        },
        800
      );
    },
  },
  watch: {
    connection() {
      this.connection.on("roomUser", (msg) => {
        if (typeof msg.viewerCount === "number") {
          this.viewerCount = msg.viewerCount;
          this.updateRoomStats();
        }
      });

      this.connection.on("like", (msg) => {
        if (typeof msg.totalLikeCount === "number") {
          this.likeCount = msg.totalLikeCount;
          this.updateRoomStats();
        }

        if (window.settings.showLikes === "0") return;
      });

      this.connection.on("member", (msg) => {
        if (window.settings.showJoins === "0") return;

        let addDelay = 250;
        if (this.joinMsgDelay > 500) addDelay = 100;
        if (this.joinMsgDelay > 1000) addDelay = 0;

        this.joinMsgDelay += addDelay;

        setTimeout(() => {
          this.joinMsgDelay -= addDelay;
          this.addChatItem("#21b2c2", msg, "joined", true);
        }, this.joinMsgDelay);
      });

      this.connection.on("chat", (msg) => {
        if (window.settings.showChats === "0") return;

        this.addChatItem("", msg, msg.comment);
      });

      this.connection.on("gift", (data) => {
        if (!this.isPendingStreak(data) && data.diamondCount > 0) {
          this.diamondsCount += data.diamondCount * data.repeatCount;
          this.updateRoomStats();
        }

        if (window.settings.showGifts === "0") return;

        this.addGiftItem(data);
      });

      this.connection.on("social", (data) => {
        if (window.settings.showFollows === "0") return;

        let color = data.displayType.includes("follow") ? "#ff005e" : "#2fb816";
        this.addChatItem(color, data, data.label.replace("{0:user}", ""));
      });

      this.connection.on("streamEnd", () => {
        $("#stateText").text("Stream ended.");

        if (window.settings.username) {
          setTimeout(() => {
            this.connect(window.settings.username);
          }, 30000);
        }
      });
    },
  },
};
