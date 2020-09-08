<template>
  <div id="tabbarLink">
    <a v-for="(item, index) in LinkList" :key="index" @click="triggerPage(item.path)">
      <Icon :type="item.imageURL" />
      {{item.name}}
    </a>
    <Dropdown @on-click="myInfo" v-if="MyInfo">
      <Badge>
        <Avatar :src="MyInfo.uploadimg" size="default" />
      </Badge>

      <DropdownMenu slot="list">
        <DropdownItem name="个人信息">个人信息</DropdownItem>
        <DropdownItem name="修改密码">修改密码</DropdownItem>
        <DropdownItem name="我的关注">我的关注</DropdownItem>
        <DropdownItem name="我的收藏">我的收藏</DropdownItem>
        <DropdownItem name="我的博客">我的博客</DropdownItem>
        <DropdownItem name="注销登录">注销登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <a v-else @click="$router.push('/login')">
      <i class="ivu-icon ivu-icon-ios-person-outline"></i>登录
    </a>
    <Modal v-model="modal1" title="退出提示" @on-ok="ok" @on-cancel="cancel">
      <p>确定要退出登陆吗？(✿◕‿◕✿)</p>
    </Modal>
  </div>
</template>
<script>
import { PostMessage } from "../NetWork/request";
export default {
  name: "tablink",
  data() {
    return {
      LinkList: [
        { name: "首页", imageURL: "md-home", path: "/" },
        {
          name: "文章列表",
          imageURL: "ios-bookmarks-outline",
          path: "/article",
        },
        { name: "Demo", imageURL: "logo-youtube", path: "/demo" },
        { name: "云相册", imageURL: "md-images", path: "/photos" },
        { name: "个人信息", imageURL: "md-person", path: "/profile" },
        { name: "留言板", imageURL: "ios-create", path: "/message" },
      ],

      MyInfo: {},

      modal1: false,
      username:null,
      imgSrc:""
    };
  },
  computed: {
    getUser() {
      return this.$store.state.user;
    },
  },

  methods: {
    triggerPage(path) {
      if (path == "/login") {
        if (localStorage.getItem("username")) {
          this.$router.push("/logined");
          return;
        } else {
          this.localStorage.removeItem("username");
          this.$router.push("/login");
        }
      } else if (path == "https://github.com/") {
        return window.open(path);
      }
      this.$router.push(path);
    },
    getInfo() {
      this.username = localStorage.getItem("username");
      if (this.username) {
        PostMessage("/user/getuserInfo", { token: this.username }).then(
          (res) => {
            if (res.data.err === 0) {
              this.MyInfo = res.data.Info[0];
              console.log('接口图片地址'+res.data.Info[0].uploadimg)
            } else if (res.data.err === -999) {
              this.$Message.error("对不起,您的登录信息已过期请重新登陆。");
              localStorage.removeItem("username");
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$Message.error(res.data.message);
            }
          }
        );
      }
    },
    myInfo(type) {
      // this.$Message.success("你点击了:" + type);
      switch (type) {
        case "我的收藏":
          this.$router.push("/favorate");
          break;
        case "注销登录":
          this.modal1 = true;
          break;
        case "我的关注":
          this.$router.push("/follows");
          break;
        case "我的博客":
          this.$router.push("/MyBlog");
          break;
        case "修改密码":
          this.$router.push("/ChangePwd");
          break;
        default:
          break;
      }
    },
    displayUserInfo(user) {
      this.MyInfo = user;
    },
    ok() {
      localStorage.clear();
      this.MyInfo = {};
      location.reload();
    },
    cancel() {
      this.$Message.success("不想退出可以多看看噢！(●ˇ∀ˇ●)");
      return;
    },
  },
  activated: function () {
  console.log('123'+this.$store.state.user)
    // console.log(JSON.parse(localStorage.getItem("userInfo")));
    // this.userInfo = localStorage.getItem("username");
    if (JSON.parse(localStorage.getItem("userInfo")) != null) {
      var user = JSON.parse(localStorage.getItem("userInfo"));
     
    }
    //  console.log(user)
    this.displayUserInfo(user);
    this.getInfo();
  },
  mounted() {
    console.log('123'+this.$store.state.user)
    // console.log(JSON.parse(localStorage.getItem("userInfo")));
    // this.userInfo = localStorage.getItem("username");
    if (JSON.parse(localStorage.getItem("userInfo")) != null) {
      var user = JSON.parse(localStorage.getItem("userInfo"));
     
    }
    //  console.log(user)
    this.displayUserInfo(user);
    this.getInfo();
  },
  created(){console.log('创建')},
  
  watch: {
    getUser: function (newVal, oldVal) {
      this.displayUserInfo(newVal);
    },
  },
};
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "codeleilei";
  src: url("../../assets/font/2012DingYongKangYingBiKaiShuXinBan-2.ttf");
}
#tabbarLink {
  display: flex;
  height: 3rem;
  justify-content: center;
  align-items: center;
  a {
    font-family: "codeleilei";
    color: #f2f2f2;
    margin: 0 1rem;
    padding: 0.3rem;
    font-size: 13px;
    transition: all 0.5s;
  }
  .s {
    color: rgb(255, 255, 255);
    display: block;
    width: 30px;
    height: 30px;
  }
  a:hover {
    background: #222;
    border-radius: 5px;
    color: lightgreen;
  }
}
</style>