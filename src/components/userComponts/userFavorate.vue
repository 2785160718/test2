<template>
  <div class="main">
  
        <div class="article-categroy">
          <div class="title">
            <Icon type="ios-aperture-outline" />文章分类
            <span>more</span>
          </div>
          <div class="categroy-item">
            <Badge
              :count="item['COUNT(article_categroy)']"
              :type="categroyColor[index]"
              v-for="(item, index) in categroysList"
              :key="index"
            >
              <p
                @click="getCategroyInfo(item.article_categroy)"
                class="demo-badge"
              >{{item.article_categroy}}</p>
            </Badge>
          </div>
        </div>
        <div class="head_title">
          <div class="left">
            <Icon type="ios-book-outline"></Icon>收藏文章列表
          </div>
          <div class="right">
            <p>共{{count}}篇</p>
          </div>
        </div>
        <div class="card" v-for="(item, index) in lists" :key="index">
          <div class="noteItem">
            <p>
              <i class="ivu-icon ivu-icon-md-bookmark"></i>
              {{item.article_brief}}
            </p>
            <p>
              <i class="iconfont icon-fangwen"></i>
              {{item.visited}}
            </p>
            <p>
              <i class="ivu-icon ivu-icon-md-person"></i>
              {{item.username}}
            </p>
          </div>
          <div class="btn">
            <Button
              class="bt"
              type="primary"
              shape="circle"
              icon="ios-search"
              @click="goDetail(item.article_id)"
            >查看</Button>

            <Button
              class="bt"
              type="warning"
              shape="circle"
              icon="ios-trash"
              @click="remove(item.article_id)"
            >移除</Button>
          </div>
        </div>
        <div class="page_">
          <Page
            ref="page"
            :total="count"
            :page-size="4"
            class="page"
            v-show="pageShow"
            @on-change="Pagechange"
            show-total
          />
        </div>
     
  </div>
</template>

<script>
import { PageSizeChange, PostMessage } from "../NetWork/request";
export default {
  data() {
    return {
      count: null,
      lists: "",
      pageShow: true,
      categroysList: [],
      categroyColor: [
        "primary",
        "success",
        "error",
        "warning",
        "primary",
        "success",
        "error",
        "warning",
      ],
    };
  },

  methods: {
    remove(id) {
      const username = localStorage.getItem("username");
      if (username) {
        PostMessage("/note/removefavorate", {
          token: username,
          id: id,
        }).then((res) => {
          if (res.data.err == 0) {
            this.$Message.success(res.data.message);
            this.getFavorate(1);
            this.getCategroys();
          } else {
            this.$Message.success("网络出错了,(ノへ￣、)！");
          }
        });
      } else {
        this.$Message.error("请登录！");
      }
    },
    goDetail(article_id) {
      this.$router.push(`/detail/${article_id}`);
    },
    getFavorate(index) {
      const username = localStorage.getItem("username");
      if (username) {
        this.$store.commit("LoadingTitleChange", {
          isshow: true,
          title: "正在加载收藏文章,请稍等...",
        });
        PageSizeChange("/page/getfavoratePage", {
          page: index,
          token: username,
        }).then((res) => {
          if (res.data.err == 0) {
            this.count = res.data.message.count;
            console.log(this.count);
            this.lists = res.data.message.data;
          } else {
            this.$Message.error("网络出错了,(ノへ￣、)！");
          }
          this.$store.commit("LoadingTitleChange", {
            isshow: false,
            title: "",
          });
        });
      } else {
        this.$Message.error("请先登录哦!");
      }
    },
    changeliked(id) {
      this.lists.forEach((element) => {
        if (element.id == id) {
          element.like_Star += 1;
          PostMessage("/note/notelike", {
            likestar: element.like_Star,
            id: id,
          }).then((res) => {
            if (res.data.err == 0) {
              this.$Message.success(
                "你为这篇文章增加了一个star谢谢你的支持鸭！(●ˇ∀ˇ●)"
              );
            } else {
              this.$Message.error(
                "网络好像有点差劲呢！小主稍后再来咱们不急！(ノへ￣、)"
              );
            }
          });
        }
      });
    },
    getCategroys() {
      const username = localStorage.getItem("username");
      PostMessage("/note/getfavoratecategroys", { token: username })
        .then((res) => {
          if (res.data.err === 0) {
            this.categroysList = res.data.message;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    getCategroyInfo(categroy) {
      const username = localStorage.getItem("username");
      this.$Spin.show();
      PostMessage("/note/getfavorateManycategroys", {
        categroy,
        token: username,
      })
        .then((res) => {
          this.$Spin.hide();
          if (res.data.err == 0) {
            this.lists = res.data.message;
            this.count = this.lists.length;
            console.log(this.count);
            this.pageShow = false;
            this.$Message.success("为您查找到标签内容!");
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    Pagechange(index) {
      const size = 4;
      const username = localStorage.getItem("username");
      this.$store.commit("LoadingTitleChange", {
        isshow: true,
        title: "正在加载文章内容,请稍等...",
      });
      PageSizeChange("/page/getfavoratenotePage", {
        page: index,
        page_size: size,
        token: username,
      }).then((res) => {
        if (res.data.err == 0) {
          this.count = res.data.message.count;
          console.log(this.count);
          this.lists = res.data.message.data;
        } else {
          this.$Message.error("网络出错了,(ノへ￣、)！");
        }
        this.$store.commit("LoadingTitleChange", { isshow: false, title: "" });
      });
    },
  },
  mounted() {
    this.getFavorate(1);
    this.getCategroys();
  },
};
</script>

<style lang="css" scoped>
@font-face {
  font-family: "leileiFont";
  src: url("../../assets/font/2012DingYongKangYingBiKaiShuXinBan-2.ttf");
}
.card {
  width: 60%;
  display: flex;
  background-color: white;
  margin: 0 auto;
  min-height: 48px;
  height: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
}
.main {
  margin-top: 40px;
  width: 100%;
  height: auto;
}
.title {
  font-family: "leileiFont";
}
.noteItem {
  font-family: "leileiFont";
  color: #657180;
  font-size: 16px;
  width: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;
}
.noteItem p {
  width: 30%;
}
.head_title {
  background-color: #fff;
  display: flex;
  font-family: "leileiFont";
  color: black;
  font-size: 15px;
  width: 60%;
  margin: 0 auto;
  height: 26px;
  justify-content: space-between;
  border: 1px solid #ccc;
}
.page_ {
  width: 60%;
  margin: 0 auto;
}
#carditem {
  width: 600px;
}
.btn {
  display: flex;

  justify-content: space-around;
  align-items: center;
  padding: 0 5px 0 0;
}
.bt {
  width: 90px;
}
.ivu-badge {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0.5rem;
  padding: 0.2rem;
  transition: opacity 0.6s;
}
.ivu-badge:hover {
  opacity: 0.8;
}

.categroy-item {
  margin-top: 0.8rem;
}
.demo-badge {
  background: #fff;
  margin: 0.1rem;
  font-size: 13px;
  cursor: pointer;
}
.article-categroy {
  border: 1px solid #ccc;
  background-color: #fff;
  width: 60%;
  margin: 0 auto;
}
@media screen and (max-width: 568px) {
  .card {
    width: 90%;
  }
  .head_title {
    width: 90%;
  }
  .article-categroy {
    width: 90%;
  }
}
@media screen and (max-width: 800px) {
  .card {
    width: 85%;
  }
  .head_title {
    width: 85%;
  }
  .article-categroy {
    width: 85%;
  }
}
</style>