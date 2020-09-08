<template>
  <div class="maininfo">
    <div class="top">
      <div class="left">
        <img :src="Myinfo.uploadimg" alt="这是头像啦啦啦" />
        <div class="info">
          <div class="name">
            <Icon type="ios-people"></Icon>
            &nbsp;&nbsp;&nbsp;{{Myinfo.username}}
          </div>
          <div class="faninfo">
            <div class="fan">
              <h3 class="num">{{fanscount}}</h3>
              <h3>他的粉丝</h3>
            </div>
            <div class="line"></div>
            <div class="like">
              <h3 class="num">{{likecount}}</h3>
              <h3>他的关注</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <a class="cancel" @click="Gz('关注',user_name)" v-if="like==false">关注</a>
        <a class="cancel" @click="Gz('取消关注',user_name)" v-else>取消关注</a>
      </div>
    </div>
    <div class="bloginfo" v-if="blogdata.length>0">
      <div class="title">博客数量{{blogdata.length}}</div>
      <div class="blogitem" v-for="(item,index) in blogdata" :key="index">
        <div class="bref">{{item.title}}</div>
        <div class="content" v-html="item.content"></div>
        <div class="log">
          <div class="visited">
            <i class="iconfont icon-fangwen"></i>
            {{item.visited}}
          </div>
          <div class="data">
            <Icon type="ios-clock"></Icon>
            {{item.time | dateFilter}}
          </div>
        </div>
      </div>
    </div>
    <div class="not" v-else>
      <h1>他还没写过博客呢</h1>
    </div>
  </div>
</template>

<script>
import { PostMessage } from "../NetWork/request";
import moment from "moment";
import marked from "marked";
export default {
  data() {
    return {
      like: false,
      Myinfo: {},
      user_name: "admin",
      likecount: 0,
      fanscount: 0,
      blogdata: [],
    };
  },
  filters: {
    dateFilter(val) {
      return moment(val).format("YYYY-MM-DD");
    },
  },
  activated: function () {
    // console.log(this.$route.params.id);
    this.getUserinfo(this.$route.params.id);
    this.isGz();
  },
  mounted() {
    // console.log(this.$route.params.id);
    this.getUserinfo(this.$route.params.id);
    this.isGz();
  },
  // destroyed(){
  //   this.$route.params.id=null;
  // },
  methods: {
    isGz() {
      const userid = this.$route.params.id;
      const username = localStorage.getItem("username");
      if (username) {
        if (userid) {
          PostMessage("/user/userIflike", {
            token: username,
            username: userid,
          }).then((res) => {
            if (res.data.err == 0) {
              console.log(res.data.message);
              if (res.data.message.islike == 0) {
                this.like = false;
              } else {
                this.like = true;
              }
            } else {
              // this.$Message.error(res.data.message);
            }
          });
        }
      } else {
        return;
      }
    },
    Gz(tp, name) {
      const username = localStorage.getItem("username");
      if (username) {
        if (tp == "关注") {
          PostMessage("/user/userFollow", {
            token: username,
            name: name,
            bage: "关注",
          }).then((res) => {
            if (res.data.err == 0) {
              this.$Message.success(res.data.message);
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$Message.error(res.data.message);
            }
          });
        } else {
          this.removeGz(name);
        }
      } else {
        this.$Message.error("您还没有登录呢！");
      }
    },
    getUserinfo(id) {
      const userid = id;
      if (userid) {
        PostMessage("/user/getuserSelfinfo", {
          user_name: userid,
        }).then((res) => {
          if (res.data.err == 0) {
            // console.log(res.data.message);
            this.fanscount = res.data.message.fancount;
            this.likecount = res.data.message.likecount;
            this.Myinfo = res.data.message.userinfodata[0];
            this.blogdata = res.data.message.blogdata;
            for (let i = 0; i < this.blogdata.length; i++) {
              let html = marked(this.blogdata[i].content);

              this.blogdata[i].content = html.replace(/<\/?[^>]*>/g, "");
            }
            if (res.data.message.userinfodata.length < 0) {
              //  console.log(res.data.message);
              this.$router.push("/notfind");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        });
      } else {
        this.$Message.error("用户不存在！");
      }
    },
  },
};
</script>

<style lang="css" scoped>
@font-face {
  font-family: "codeleilei";
  src: url("../../assets/font/2012DingYongKangYingBiKaiShuXinBan-2.ttf");
}
.not {
  font-family: "codeleilei";
  width: 100%;
  text-align: center;
}
.title {
  padding-left: 10px;
  border-bottom: 1px solid #e0e0e0;
}
.log {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  width: 828px;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: wrap;
}
.bref {
  font-size: 20px;
  color: #5a5a5a;
  font-weight: 700;
  line-height: 30px;
  padding-bottom: 4px;
}
.bref:hover {
  color: rgb(187, 48, 48);
}
.blogitem {
  padding: 14px 24px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e0e0e0;
}
.bloginfo {
  font-family: "codeleilei";
  margin-top: 15px;
  width: 900px;
  border: 1px solid rgb(184, 179, 179);
  border-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.name {
  font-size: 26px;
  color: #4d4d4d;
  min-height: 24px;
  margin-left: 5px;
}
.faninfo {
  display: flex;
  justify-content: space-around;
  width: 200px;
}
.like,
.fan {
  display: flex;
  flex-direction: column;
}
.like:hover .num {
  color: coral;
}
.fan:hover .num {
  color: coral;
}
.fan {
  display: flex;
  flex-direction: column;
}
.line {
  width: 1px;
  height: 48px;
  background-color: rgb(206, 196, 196);
}
.info {
  width: 370px;
  display: flex;
  margin-top: 27px;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.left {
  display: flex;
}
.maininfo {
  width: 900px;
  height: 100%;
  margin: 0 auto;
}
.top {
  font-family: "codeleilei";
  margin-top: 50px;
  border: 1px solid rgb(184, 179, 179);
  border-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 900px;
  height: 170px;

  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  box-shadow: 0 0 5px #ccc;
  margin: 19px 24px 32px;
  position: relative;
  z-index: 3;
}
.cancel {
  display: block;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid #999;
  border-radius: 4px;
  font-size: 14px;
  color: #999;
  width: 90px;
  height: 32px;

  background: #fff;
  text-align: center;
  line-height: 32px;
}
.cancel:hover {
  background: rgb(255, 211, 211);
  transition: all 0.8s;
}
@media screen and (max-width: 800px) {
  .maininfo {
    width: 700px;
    margin: 0 auto;
  }
  .top {
    margin-top: 30px;
    width: 500px;
    margin: 0 auto;
  }
  .info {
    width: 170px;
  }
}
@media screen and (max-width: 400px) {
  .maininfo {
    width: 100%;
    margin: 0 auto;
  }
  .top {
    margin-top: 30px;
    width: 100%;
    margin: 0 auto;
  }
  img {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    box-shadow: 0 0 5px #ccc;
    margin: 13px 17px 25px;
    position: relative;
    z-index: 3;
  }
  .info {
    width: 200px;
    margin-top: 16px;
  }
  .cancel{
    width: 80px;
  }
}
</style>

