<template>
  <div class="main">
    <!-- <Col :xl="3" :lg="3" :md="2" :sm="1" :xs="0">
        <header>.</header>
    </Col>-->

    <div class="left">
      <div class="top">
        <div class="nameimg">
          <img width="100" height="100" :src="userinfo.uploadimg" />
          <span>昵称:{{userinfo.name}}</span>
        </div>
        <div class="botton">
          <span>获赞:{{dianzan}}</span>
          &nbsp;&nbsp;&nbsp;
          <span>访问:{{visited}}</span>
        </div>
      </div>
      <div class="search">
        <input placeholder="输入文章关键词搜索.." type="text" v-model="likeSearch" />
        <button class="search-btn" @click="searchLike">search</button>
      </div>
      <div class="new">
        <div class="time-article">
          <div class="title">
            <Icon type="ios-timer" />最近文章
            <span>more</span>
          </div>
          <div
            class="ItemList"
            v-for="(item, index) in navList"
            @click="timeArticle(item.article_id)"
            :key="index"
          >
            <Tooltip content="点击跳转到详情">{{item.title}}</Tooltip>
            <span>
              <Icon type="ios-clock-outline" />
              {{item.time | dateFilter}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="bloginfo" v-if="userbloginfo.length>0">
        <div class="title">博客数量{{userbloginfo.length}}</div>
        <div class="blogitem" v-for="(item,index) in userbloginfo" :key="index">
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
          <div class="btn">
            <button class="search-btn2" @click="show(item.article_id)">修改</button>
            &nbsp;
            <button class="search-btn2" @click="remove(item.article_id)">删除</button>
          </div>
        </div>
      </div>
      <div class="not" v-else>
        <h1>他还没写过博客呢</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { PostMessage } from "../NetWork/request";
import debounce from "../debounce/debounce";
import moment from "moment";
export default {
  data() {
    return {
      userbloginfo: [],
      shoucang: 0,
      dianzan: 0,
      fensi: 0,
      pinglun: 0,
      visited: 0,
      userinfo: [],
      navList: null,
      likeSearch: null,
    };
  },
  filters: {
    dateFilter(V) {
      return moment(V).format("YYYY-MM-DD");
    },
  },
  methods: {
    show(index) {
      const res = this.IsPC();
      if (res == true) {
        this.$router.push("/userarticelUpdate/" + index);
      } else {
        this.$Message.error("请在pc端修改博客~");
      }
    },
    IsPC() {
      let userAgentInfo = navigator.userAgent;
      let Agents = [
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod",
      ];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    remove() {},
    searchLike: debounce(function () {
      if (!this.likeSearch) return this.$Message.error("搜索内容不能为空的呀~");
      this.likesearchTool();
    }, 800),
    // 搜索工具
    likesearchTool() {
      const username = localStorage.getItem("username");
      PostMessage("/user/like_article_search", {
        value: this.likeSearch,
        token: username,
      }).then((res) => {
        if (res.data.err === 0) {
          this.userbloginfo = res.data.message;
          console.log(this.userbloginfo);
          this.count = res.data.message.length;
          if (this.count === 0) {
            this.$Message.success("暂时没有这个区域的内容,欢迎留言建议!");
          } else {
            this.$Message.success("查询成功了!");
          }
        } else {
          this.$Message.error(res.data.message); // 未知错误
        }
      });
    },
    getUserbloglist() {
      const username = localStorage.getItem("username");
      if (username) {
        PostMessage("/user/getuserBlog", { token: username }).then((res) => {
          if (res.data.err == 0) {
            this.userbloginfo = res.data.message.data;
            for (let i = 0; i < this.userbloginfo.length; i++) {
              this.visited += this.userbloginfo[i].visited;
              this.dianzan += this.userbloginfo[i].like_Star;
            }
            console.log(this.userbloginfo);
          } else {
            this.$Message.error(res.data.message);
          }
        });
      } else {
        this.$Message.error("请登录！");
      }
    },
    getTimearticel() {
      const username = localStorage.getItem("username");
      PostMessage("/user/gettimenoteList", { token: username }).then((res) => {
        this.navList = res.data;
      });
    },
  },
  mounted() {
    this.getTimearticel();
    this.getUserbloglist();
    this.userinfo = JSON.parse(localStorage.getItem("userInfo"))[0];
    // console.log(this.userinfo);
  },
};
</script>

<style lang="css" scoped>
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
  width: 680px;
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
  /* margin-top: 15px; */
  width: 700px;
  border: 1px solid rgb(184, 179, 179);
  border-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.main {
  margin: 0 auto;
  width: 80%;
  height: 100%;
  display: flex;
 
}
.left {
  margin-top: 20px;
  width: 300px;
}
.right .bloginfo{
  padding-bottom: 30px;
}
.right {
  margin-top: 20px;
  width: 700px;
  
}
.top {
  border: 1px solid gray;
  border-radius: 2px;
  font-family: "codeleilei";
  font-size: 16px;
}
.nameimg {
  display: flex;
  align-items: center;
}
.ItemList span {
  font-size: 12px;
  color: purple;
  font-weight: bold;
  white-space: nowrap;
}
.ItemList {
  padding: 0.8rem 0.5rem;
  cursor: pointer;
  color: #555;
  border-bottom: 1px solid #ccc;
  transition: all 0.6s;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ItemList:last-child {
  border-bottom: none;
}
.ItemList:hover {
  background: #f2f2f2;
  color: lightgreen;
  padding-left: 0.8rem;
}
.new {
  border: 1px solid gainsboro;
}

.search {
  width: 100%;
  margin-bottom: 1rem;
}
input,
.search-btn {
  outline: none;
  border: 1px solid #ccc;
}
input {
  width: 76%;
  border-right: none;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding: 4px 0;
  text-indent: 5px;
}
button.search-btn {
  cursor: pointer;
  width: 24%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: deepskyblue;
  color: white;
  height: 32px;
  font-size: 13px;
}
.search-btn2 {
  cursor: pointer;
  width: 48px;
  border-radius: 5px;

  background: deepskyblue;
  color: white;
  height: 32px;
  font-size: 13px;
  border: none;
}
@media screen and (max-width: 1060px) {
  .top img {
    width: 50px;
    height: 50px;
  }
}
@media screen and (max-width: 600px) {
  .left {
    margin: 0 auto;
    width: 80%;
  }
  .main {
    margin: 0 auto;
    width: 600px;
    display: flex;
    flex-direction: column;
  }
  .right {
    margin: 0 auto;
    width: 80%;
  }
  .bloginfo {
    width: 480px;
    margin: 0 auto;
    max-width: 600px;
  }
  .content {
    width: 450px;
  }
}

@media screen and (max-width: 375px) {
  .left {
    margin: 0 auto;
    width: 90%;
  }
  .main {
    margin: 0 auto;
padding-bottom: 30px;
    width: 90%;
    display: flex;
    flex-direction: column;
   
  }

  .right {
    margin: 0 auto;
    width: 100%;
    /* height: 100px; */
  }
  .bloginfo {
    width: 90%;
    margin: 0 auto;
    max-width: 375px;
  }
  .content {
    width: 90%;
  }
}
</style>