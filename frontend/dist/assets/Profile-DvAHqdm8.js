import{r as t,j as e,b as j}from"./index-DDoEHnfR.js";import{L as f}from"./Layout-Co7qzEc2.js";import{S as N}from"./SideBar-DCoEgSRU.js";const b=({isOpen:s,onClose:r,onImageUpdate:g,currentImage:u})=>{const[n,c]=t.useState(null),[o,h]=t.useState(""),[m,d]=t.useState(!1),p=l=>{const a=l.target.files[0];a&&(c(a),h(URL.createObjectURL(a)))},x=async()=>{if(!n)return;const l=new FormData;l.append("profileImage",n);for(let[a,i]of l.entries())console.log(`${a}:`,i);console.log("Profile image is:",l.get("profileImage"));try{d(!0);const a=await j.post("/api/v1/auth/upload-profile-image",l,{headers:{"Content-Type":"multipart/form-data"}});g(a.data.image),r()}catch(a){console.error("Error uploading image:",a)}finally{d(!1)}};return s?e.jsxs("div",{className:"modal-overlay",children:[e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Edit Profile Image"}),e.jsx("button",{onClick:r,className:"close-btn",children:"×"})]}),e.jsx("div",{className:"modal-body",children:e.jsxs("div",{className:"upload-section mt-3",children:[e.jsx("input",{type:"file",onChange:p,accept:"image/*",className:"form-control"}),o&&e.jsxs("div",{className:"preview-image mt-3",children:[e.jsx("h4",{children:"Preview"}),e.jsx("img",{src:o,alt:"Preview",style:{maxWidth:"200px"}})]})]})}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn btn-secondary",onClick:r,disabled:m,children:"Cancel"}),e.jsx("button",{className:"btn btn-primary",onClick:x,disabled:!n||m,children:"Upload"})]})]}),e.jsx("style",{jsx:!0,children:`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .modal-footer {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .current-image,
        .preview-image {
          text-align: center;
          margin-bottom: 20px;
        }
      `})]}):null},w=()=>{var d,p,x,l;const[s,r]=t.useState({userName:"",role:"",userPictures:[],number:"",email:"",_id:""}),[g,u]=t.useState(!1),n=localStorage.getItem("auth"),c=JSON.parse(n),o=(d=c==null?void 0:c.user)==null?void 0:d._id,h=async()=>{var a;try{const i=await j.get(`/api/v1/auth/get-profile/${o}`);(a=i==null?void 0:i.data)!=null&&a.user&&r(i.data.user)}catch(i){console.log("Error fetching profile:",i)}};t.useEffect(()=>{h()},[o]);const m=a=>{r(i=>({...i,userPictures:a?[{img:a}]:[]}))};return e.jsx(f,{children:e.jsxs("main",{class:"crm_all_body d-flex",children:[e.jsx(N,{}),e.jsxs("div",{className:"crm_right relative",children:[e.jsx("button",{className:"btn btn-sm btn-warning mt-2",onClick:()=>u(!0),children:"Edit image"}),e.jsx(b,{isOpen:g,onClose:()=>u(!1),onImageUpdate:m,currentImage:(p=s==null?void 0:s.userPictures[0])==null?void 0:p.img}),e.jsx("div",{className:"profile_card1",children:e.jsxs("div",{className:"profile_content1",children:[e.jsx("div",{className:"profile_img_1",children:(x=s==null?void 0:s.userPictures[0])!=null&&x.img?e.jsx(e.Fragment,{children:e.jsx("div",{children:e.jsx("img",{src:`http://localhost:8000/uploads/${(l=s==null?void 0:s.userPictures[0])==null?void 0:l.img}`,alt:"agent"})})}):e.jsx(e.Fragment,{children:e.jsx("div",{children:"loading........."})})}),e.jsxs("div",{className:"profile_content_c",children:[e.jsx("div",{className:"profile_img_11 text-center",children:e.jsx("img",{src:"/imgs/profile-icon.png"})}),e.jsx("div",{className:"profile_header_p text-center",children:"Growth and Comfort do not Coexist"}),e.jsxs("ul",{className:"profile_ul_c",children:[e.jsxs("li",{className:"upper_case",children:[e.jsx("img",{src:"/imgs/employe-id.png"}),"Employe Id"]}),e.jsx("li",{children:s._id})]}),e.jsxs("ul",{className:"profile_ul_c",children:[e.jsxs("li",{className:"upper_case",children:[e.jsx("img",{src:"/imgs/employe-id.png"}),"Name"]}),e.jsx("li",{children:s.userName})]}),e.jsxs("ul",{className:"profile_ul_c",children:[e.jsxs("li",{className:"upper_case",children:[e.jsx("img",{src:"/imgs/employe-id.png"}),"Role"]}),e.jsx("li",{children:s.role})]}),e.jsxs("ul",{className:"profile_ul_c",children:[e.jsxs("li",{className:"upper_case",children:[e.jsx("img",{src:"/imgs/employe-id.png"}),"Email"]}),e.jsx("li",{children:s.email})]}),e.jsxs("ul",{className:"profile_ul_c",children:[e.jsxs("li",{className:"upper_case",children:[e.jsx("img",{src:"/imgs/employe-id.png"}),"Phone Number"]}),e.jsx("li",{children:s.number})]})]})]})})]})]})})};export{w as default};
