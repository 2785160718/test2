<template>
  <div class="publish">
    <div class="container">
      <h2>
        <i class="iconfont icon-wenzhang"></i> 文章内容编辑与发表
      </h2>
      <p>
        <i class="iconfont icon-lianjie"></i> 文章标题:
      </p>
      <Input v-model="articleDate.title" style="width:80%" placeholder="请输入文章标题..." />
      <p>
        <img v-show="articleDate.src" :src="articleDate.src" alt="笔记中的图片" />
      </p>
      <Upload action="http://192.168.43.175:3006/upload/imageUpload" :on-success="handleSuccess">
        <Button icon="ios-cloud-upload-outline">选择文章封面图片</Button>
      </Upload>
      <p>
        <i class="iconfont icon-lianjie"></i> 文章简介:
      </p>
      <Input
        v-model="articleDate.brief"
        style="width:80%"
        type="textarea"
        :rows="4"
        placeholder="请输入文章简介..."
      />
      <p>
        <i class="iconfont icon-lianjie"></i> 文章主体内容:
      </p>
     <mavon-editor
    
     class="editor"
        v-model="articleDate.content"
        ref="md"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        @change="change"
        style="min-height: 600px"
      />
      <p>
        <i class="iconfont icon-lianjie"></i> 文章标签:
      </p>
      <Input v-model="articleDate.lable" style="width:200px" placeholder="文章标签" />
      <p>
        <i class="iconfont icon-lianjie"></i> 文章分类:
      </p>
      <Input v-model="articleDate.categroy" style="width:200px" placeholder="文章分类" />
      <div class="event-Button">
        <Button @click.native="handelPublish" type="primary">发表</Button>
        <Button type="default">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { PostMessage } from "../components/NetWork/request";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "articlePublish",
  props: [],
  components: {
    mavonEditor
  },
  data() {
    return {
      articleDate: {
        src: "",
        title: "",
        brief: "",
        content: "",
        lable: "",
        categroy: "",
        username:"",
      },
       content: "",
      html: "",
      configs: {},
      url:
        "http://192.168.0.100:3006/images/8335b9017c1b2748e5c8d19d896b03e1.jpg"
    };
  },
  methods: {
    handleSuccess(res) {
      this.articleDate.src = res.url;
    },
    handelPublish() {
      this.articleDate.username = localStorage.getItem("username");
      
      if (
        !this.articleDate.src ||
        !this.articleDate.content ||
        !this.articleDate.title ||
        !this.articleDate.brief ||
        !this.articleDate.categroy ||
        !this.articleDate.lable
      )
        return this.$Message.error("请输入完整的文章信息!");
      const obj = this.articleDate;
      const path = this.articleDate.lable + Math.floor(Math.random() * 2000000);
      obj.articlePath = path;
      PostMessage("/note/articlePublish", obj).then(res => {
        if (res.data.err == 0) {
          this.$router.replace("/admin/article");
          this.$Message.success(res.data.message);
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    $imgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("imgFile", $file);
      PostMessage("/upload/imagearticle", formdata)
        .then(res => {
          console.log(res.data);
          this.$refs.md.$img2Url(pos, res.data.url);
        })
        .catch(err => {
          console.log(err);
        });
    },
    $imgDel(pos) {
      
      let param = new URLSearchParams();
      param.append("url", pos[0]);
      PostMessage("/upload/delImg", param)
        .then(res => {
          console.log(res.data);
          if (res.data.err == 0) {
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    // 提交
    submit() {
      console.log(this.content);
      console.log(this.html);
      this.$message.success("提交成功，已打印至控制台！");
    },
    test() {
      let param = new URLSearchParams();
      param.append("url", this.url);
      PostMessage("/upload/delImg", param)
        .then(res => {
          console.log(res.data);
          if (res.data.err == 0) {
            this.$message.success("删除成功！");
          } else {
            this.$message.error("删除失败！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss">
.publish {
  .container {
    position: relative;
    
    z-index: 99;
    img {
      width: 400px;
      height: 300px;
    }
    p {
      color: #333;
      font-weight: bold;
      margin: 1rem 0;
    }
    .event-Button {
      margin-top: 1rem;
      button {
        margin-right: 1rem;
      }
    }
  }
}
.editor{
    width: 980px;
}
</style>