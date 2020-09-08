<template>
  <div id="Login">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" :lable-width="80">
      <FormItem>
        <div :style="{color:Color}" class="logintitle">更改账户密码!</div>
      </FormItem>
      <FormItem prop="user" v-if="is_pass_old">
        <Input type="password" v-model="formInline.password_old" placeholder="请输入旧密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password" v-if="is_pass_new">
        <Input type="password" v-model="formInline.password_new" placeholder="请输入新密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem v-if="isshow" prop="email">
        <Input placeholder="Email" v-model="formInline.email" :disabled="showEmail">
          <span slot="append">@qq.com</span>
        </Input>
        <Button
          v-text="btntext"
          :disabled="showBtn"
          @click.native="sendMail"
          class="btns"
          style="margin:0.5rem 0;"
          type="primary"
        >发送验证码</Button>
      </FormItem>
      <FormItem v-if="isshow" prop="value">
        <Input class="put_code" v-model="formInline.code" placeholder="输入验证码"></Input>
      </FormItem>
      <FormItem>
        <Button class="btns" @click="handleSubmit('formInline')">确认修改</Button>
        <Button class="btns" style="margin-left:1rem;" type="default" @click="register">邮箱验证</Button>
      </FormItem>
      <FormItem>
        <p :style="{color:Color}" style="font-size:1rem;">提示: 没有账号可以点击我是新人进行注册,只需要验证邮箱就可以了,欢迎你的加入！</p>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { PostMessage } from "../components/NetWork/request";
export default {
  data() {
    return {
      userInfo: null,
      userinfo: [],
      ismail: false,
      is_pass_old: true,
      is_pass_new: true,
      isshow: false,
      showBtn: false,
      showEmail: false,
      timer: null,
      count: 60,
      btntext: "发送验证码",
      formInline: {
        token: null,
        password_old: "",
        password_new: "",
        email: "",
        code: "",
      },
      ruleInline: {
        password_old: [
          {
            required: true,
            message: "快快输入用户名,时间不等人呐!",
            trigger: "blur",
          },
          {
            type: "string",
            max: 11,
            min: 5,
            message: "用户长度最少为5位,最多11位哦,（＞人＜；）",
            trigger: "blur",
          },
        ],
        password_new: [
          { required: true, message: "还有密码密码密码!", trigger: "blur" },
          {
            type: "string",
            min: 8,
            max: 16,
            message: "密码长度最少为8位,最多16位哦,（＞人＜；）",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "这里填你的qq号鸭,我会给你发邮箱验证的,填你注册账号的qq哦",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "你还没有输入验证码,不要着急！",
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {
    Color() {
      return this.$store.state.Color;
    },
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("userInfo"))[0];
    this.userInfo = localStorage.getItem("username");
    let qq = this.userinfo.email.split("@");
    this.formInline.email = qq[0];
  },
  methods: {
    register() {
      this.is_pass_old = !this.is_pass_old;
      this.is_pass_new = true;
      this.isshow = !this.isshow;
      this.ismail = !this.ismail;
    },
    sendMail() {
      /* 发送邮箱验证码 */
      if (this.formInline.email != "") {
        /* 验证邮箱是正确 */
        var reg = /^\d{5,10}$/;
        if (reg.test(this.formInline.email) == true) {
          /* 发起验证码请求 */
          PostMessage("/user/emailInfo", {
            email: this.formInline.email + "@qq.com",
          }).then((res) => {
            if (res.data.err == 0) {
              /* 发送成功 */
              this.$Message.success(
                "验证码已经发送到小主的邮箱了,(●ˇ∀ˇ●) ，如果未收到请前往垃圾邮件中查看！"
              );

              localStorage.setItem(
                "dlsjalkjdkljaslfjldjgltlfgdoeiroeiotgjfkdjk",
                60
              );
              this.showBtn = true;
              this.count = 60;
              this.timer = setInterval(() => {
                this.count -= 1;
                if (this.count == 0) {
                  clearInterval(this.timer);
                  localStorage.removeItem(
                    "dlsjalkjdkljaslfjldjgltlfgdoeiroeiotgjfkdjk"
                  );
                  this.btntext = "发送验证码";
                  this.showBtn = false;
                } else {
                  this.btntext = `${this.count}秒后重新发送`;
                  localStorage.setItem(
                    "dlsjalkjdkljaslfjldjgltlfgdoeiroeiotgjfkdjk",
                    this.count
                  );
                }
              }, 1000);
            } else {
              this.$Message.error(res.data.message);
            }
          });
        } else {
          this.$Message.error("输入正确的邮箱噢，太马虎啦！");
        }
      } else {
        this.$Message.error("邮箱不能空着呢！");
      }
    },
    handleSubmit() {
      if (this.userInfo == null) {
        this.$Message.error("对不起,您的登录信息已过期请重新登陆。");
        this.$router.push("/Login");
        return;
      }
      if (this.ismail == true) {
        if (!this.formInline.password_new || !this.formInline.code) {
          this.$Message.error("验证码或者密码不能为空哦！");
          return;
        } else {
          this.$store.commit("LoadingTitleChange", {
            isshow: true,
            title: "正在修改您的账号请稍等...",
          });
          this.formInline.password_old="";
          this.formInline.token = localStorage.getItem("username");
          // console.log(this.formInline.username);
          PostMessage("/user/changePwd", this.formInline).then((res) => {
            if (res.data.err == 0) {
              clearInterval(this.timer);
              localStorage.removeItem(
                "dlsjalkjdkljaslfjldjgltlfgdoeiroeiotgjfkdjk"
              );
              this.$Message.error(
                "修改成功啦小主,对不起,您的登录信息已过期请重新登陆。"
              );
              localStorage.removeItem("username");
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            } else {
              this.$Message.error(res.data.message);
            }
            this.$store.commit("LoadingTitleChange", {
              isshow: false,
              title: "",
            });
          });
        }
      } else {
        if (!this.formInline.password_new || !this.formInline.password_old) {
          this.$Message.error("密码不能为空哦！");
          return;
        } else {
          this.formInline.email="";
          this.formInline.code="";
          this.$store.commit("LoadingTitleChange", {
            isshow: true,
            title: "正在修改您的账号请稍等...",
          });
          this.formInline.token = localStorage.getItem("username");
          // console.log(this.formInline.username);
          PostMessage("/user/changePwd", this.formInline).then((res) => {
            if (res.data.err == 0) {
              clearInterval(this.timer);
              localStorage.removeItem(
                "dlsjalkjdkljaslfjldjgltlfgdoeiroeiotgjfkdjk"
              );
              this.$Message.error(
                "修改成功啦小主,对不起,您的登录信息已过期请重新登陆。"
              );
              localStorage.removeItem("username");
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            } else {
              this.$Message.error(res.data.message);
            }
            this.$store.commit("LoadingTitleChange", {
              isshow: false,
              title: "",
            });
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#Login {
  width: 90%;
  height: 80vh;
  margin: 0 auto;
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .btns,
  .put_code {
    position: relative;
    z-index: 5;
  }
  .btns:nth-child(1) {
    background: rgb(53, 138, 235);
    color: white;
    border: 0;
  }
  .logintitle {
    font-size: 2rem;
  }
}
</style>