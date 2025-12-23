import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import axios from "axios";
import EditProfileImageModal from "../../components/EditProfileImageModal.jsx";
import "../../css/profileImage.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    userName: "",
    role: "",
    userPictures: [],
    number: "",
    email: "",
    _id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userRole = localStorage.getItem("auth");
  const userProfile = JSON.parse(userRole);
  const id = userProfile?.user?._id;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/v1/auth/get-profile/${id}`);
      if (res?.data?.user) {
        setProfile(res.data.user);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleImageUpdate = (newImage) => {
    setProfile(prev => ({
      ...prev,
      userPictures: newImage ? [{ img: newImage }] : []
    }));
  };

  return (
    <Layout>
      <main class="crm_all_body d-flex">
        <SideBar />
        
        
        <div className="crm_right relative">
           <button 
                  className="btn btn-sm btn-warning mt-2" 
                  onClick={() => setIsModalOpen(true)}
                  
                >
                  Edit image
                </button>
              <EditProfileImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onImageUpdate={handleImageUpdate}
                currentImage={profile?.userPictures[0]?.img}
              />
          <div className="profile_card1">
            <div className="profile_content1">
              <div className="profile_img_1">
                {profile?.userPictures[0]?.img ? (
                  <>
                  <div>

                  <img
                        src={`${
                          import.meta.env.VITE_REACT_APP_MAIN_URL
                        }uploads/${profile?.userPictures[0]?.img}`}
                        alt="agent"
                      />
                  </div>
                 
                  </>
                  
                 
                ) : (
                  <>
                  <div>
                    {/* <img src="/imgs/profile-icon.png" alt="Default profile" /> */}
                    loading.........
                  </div>
                  </>
                  
                )}
               
              </div>
              
        

              <div className="profile_content_c">
                <div className="profile_img_11 text-center">
                    <img src = "/imgs/profile-icon.png" /> 
                </div>
                 
                <div className="profile_header_p text-center">Growth and Comfort do not Coexist</div>
                 <ul className="profile_ul_c">
                    <li className="upper_case">
                        <img src = "/imgs/employe-id.png" />
                        Employe Id</li>
                    <li>{profile._id}</li>
                    
                 </ul>
                  <ul className="profile_ul_c">
                    <li className="upper_case">
                        <img src = "/imgs/employe-id.png" />
                        Name</li>
                    <li>{profile.userName}</li>
                    
                 </ul>
                 <ul className="profile_ul_c">
                    <li className="upper_case">
                        <img src = "/imgs/employe-id.png" />
                        Role</li>
                    <li>{profile.role}</li>
                    
                 </ul>
                 <ul className="profile_ul_c">
                    <li className="upper_case">
                        <img src = "/imgs/employe-id.png" />
                        Email</li>
                    <li>{profile.email}</li>
                    
                 </ul>
                  <ul className="profile_ul_c">
                    <li className="upper_case">
                        <img src = "/imgs/employe-id.png" />
                        Phone Number</li>
                    <li>{profile.number}</li>
                    
                 </ul>
              </div>
              
            </div>
            
          </div>
         
        </div>

        
       
      </main>
    </Layout>
  );
};

export default Profile;
