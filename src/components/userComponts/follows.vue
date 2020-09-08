<template>
  <div class="container">
  
        <div class="menu-top menuBody">
          <Tabs class="tb">
            <TabPane label="关注" icon="ios-heart">
              <div class="fallow">
                <div class="top">
                  <h2>我的关注</h2>
                  <span>共{{countguanzhu}}人</span>
                </div>
                <div class="followitem" v-for="(item, index) in guanzhulist" :key="index">
                  <div class="left">
                    <img :src="item.uploadimg" @click="selfPage(item.username)" alt />
                    <span class="name">{{item.username}}</span>
                  </div>
                  <div class="right">
                    <a @click="removeGz(item.username)" class="cancel">取消关注</a>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane label="粉丝" icon="ios-pricetags">
              <div class="fallow">
                <div class="top">
                  <h2>我的粉丝</h2>
                  <span>共{{countfensi}}人</span>
                </div>
                <div class="followitem" v-for="(item, index) in fensilist" :key="index">
                  <div class="left">
                    <img :src="item.uploadimg" @click="selfPage(item.username)" alt />
                    <span class="name">{{item.username}}</span>
                  </div>
                  <div class="right">
                    <a
                      class="cancel"
                      @click="fensi('关注',item.username)"
                      v-if="item.isguanzhu==false"
                    >关注</a>
                    <a class="cancel" @click="fensi('取消关注',item.username)" v-else>取消关注</a>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
    
  </div>
</template>

<script>
import { PostMessage } from "../NetWork/request";
export default {
  data() {
    return {
      countfensi: null,
      countguanzhu: null,
      guanzhulist: [],
      fensilist: [],
    };
  },
  methods: {
    selfPage(name) {
      // alert(name)
      this.$router.push(`/personInfo/${name}`);
    },
    getUserinfo() {
      const username = localStorage.getItem("username");
      if (username) {
        PostMessage("/user/getUserFollow", { token: username }).then((res) => {
          if (res.data.err == 0) {
            this.countfensi = res.data.message.countfensi;
            this.countguanzhu = res.data.message.countguanzhu;
            this.guanzhulist = res.data.message.dataguanzhu;
            this.fensilist = res.data.message.datafensi;

            for (let i = 0; i < this.fensilist.length; i++) {
              for (let j = 0; j < this.guanzhulist.length; j++) {
                if (
                  this.guanzhulist[j].username == this.fensilist[i].username
                ) {
                  this.fensilist[i].isguanzhu = true;
                  break;
                } else {
                  this.fensilist[i].isguanzhu = false;

                  continue;
                }
              }
            }
          }
        });
      } else {
        this.$Message.error("请登录！");
      }
    },
    removeGz(name) {
      const username = localStorage.getItem("username");

      PostMessage("/user/userFollow", {
        token: username,
        name: name,
        bage: "取消关注",
      }).then((res) => {
        if (res.data.err == 0) {
          this.$Message.success(res.data.message);
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
    },
    fensi(tp, name) {
      if (tp == "关注") {
        const username = localStorage.getItem("username");
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
    },
  },
  mounted() {
    this.getUserinfo();
  },
};
</script>

<style lang="css" scoped>
@font-face {
  font-family: "leileiFont";
  src: url("../../assets/font/2012DingYongKangYingBiKaiShuXinBan-2.ttf");
}
.container {
  font-family: "leileiFont";
  margin-top: 50px;
  width: 90%;
}
.menuBody {
  margin: 0 auto;
  width: 60%;
  display: flex;
  justify-content: space-around;
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
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 2s;
  box-shadow: 0 0 5px #fff;
  margin: 1rem;
}
.left {
  display: flex;
  align-items: center;
}
.top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
}
.followitem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}
.tb {
  width: 100%;
}
.ivu-tabs-nav {
  width: 100%;
}
i {
  color: black;
}
@media screen and (max-width: 1200px) {
  .menuBody {
    width: 70%;
  }
}
@media screen and (max-width: 800px) {
  .menuBody {
    width: 75%;
  }
}
@media screen and (max-width: 600px) {
  .menuBody {
    width: 80%;
  }
}
@media screen and (max-width: 400px) {
  .menuBody {
    width: 90%;
  }
}
</style>