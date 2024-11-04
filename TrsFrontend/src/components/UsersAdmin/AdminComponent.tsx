/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import axios from "../../api/axios";
import UsersTable from "./UserTable";
import StitchInfosTable from "./StitchInfo/StitchInfosTable";
import ContributionInfosTable from "./Contribution/ContributionInfosTable";
import ArticleInfoTable from "./Article/ArticleInfoTable"; 
import UnitsTable from "./Unit/UnitModalTable";
import CreateUserModal from "./CreateUserModal";
import CreateContributionInfoModal from "./Contribution/CreateContributionInfoModal";
import CreateArticleInfoModal from "./Article/CreateArticleInfoModal"; 
import EditUserModal from "./EditUserModal";
import CreateStitchInfoModal from "./CreateStitchInfoModal";
import EditStitchInfoModal from "./StitchInfo/EditStitchInfoModal";
import EditContributionInfoModal from "./Contribution/EditContributionInfoModal";
import EditArticleInfoModal from "./Article/EditArticleInfoModal"; 
import { UsersContext, UsersContextType } from "../../Context/UserAdminProvider";
import toast from "react-hot-toast";
import EditUnitModal from "./Unit/EditUnitModal";
import CreateUnitModal from "./Unit/CreateUnitModal";

const AdminComponent = () => {
  const {isOpen:isCreateContributionOpen,onOpen: onOpenCreateContributionInfo, onClose: onCloseCreateContribution} = useDisclosure();
  const { isOpen: isCreateUserOpen, onOpen: onOpenCreateUser, onClose: onCloseCreateUser } = useDisclosure();
  const { isOpen: isCreateStitchOpen, onOpen: onOpenCreateStitch, onClose: onCloseCreateStitch } = useDisclosure();
  const { isOpen: isCreateArticleOpen, onOpen: onOpenCreateArticle, onClose: onCloseCreateArticle } = useDisclosure(); 
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditStitchOpen, setIsEditStitchOpen] = useState(false);
  const [isEditContributionOpen, setIsEditContributionOpen] = useState(false);
  const [isEditArticleOpen, setIsEditArticleOpen] = useState(false); 
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isCreateUnitOpen, setIsCreateUnitOpen] = useState(false);
  const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStitchInfo, setSelectedStitchInfo] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedArticle, setSelectedArticle] = useState<any>(null); 
  const { users, stitchInfos, contributions, articles, setUsers, setStitchInfos, setContributions, setArticles }: UsersContextType = useContext(UsersContext);
 

  const fetchData = async () => {
    try {
      const usersResponse = await axios.get("/api/users");
      setUsers(usersResponse.data);
  
      const stitchInfosResponse = await axios.get("/api/admin/allstitchInfo");
      setStitchInfos(stitchInfosResponse.data);
      console.log("Stitch infos ", stitchInfosResponse.data);
  
      const contributionsResponse = await axios.get("/api/admin/allcontribution");
      
      if (contributionsResponse.data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contributionsResponse.data.forEach((element: { stitchId: any; stitchType: any; stitchName: any; }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stcInfo = stitchInfosResponse.data.filter((stc: { id: any; }) => stc.id == element.stitchId)[0];
          if (stcInfo != undefined) {
            element.stitchType = stcInfo.stitchType;
            element.stitchId = stcInfo.id;
            element.stitchName = stcInfo.stitchName;
          }
        });
      }
      
      setContributions(contributionsResponse.data);
      console.log("Contributions Response", contributionsResponse.data);
      const articlesResponse = await axios.get("/api/admin/allarticleinfo");
      setArticles(articlesResponse.data);
      console.log("Articles Response", articlesResponse.data);
      // Fetch units
      const unitsResponse = await axios.get("/api/admin/allunit");
      setUnits(unitsResponse.data); 
      
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [setUsers, setStitchInfos, setContributions, setArticles]);

  const handleCreateUser = async (newUser: any) => {
    try {
      await axios.post("/api/Users", newUser);
      toast.success("User created successfully.");
      fetchData();
      onCloseCreateUser();
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Error creating user.");
      } else {
        toast.error("Network error while creating user.");
      }
    }
  };

  const handleCreateContribution = async (newContribution: any) => {
    try {
      
      await axios.post("/api/admin/contribution", newContribution);
      toast.success("Contribution created successfully.");
      fetchData();
      onCloseCreateContribution();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating contribution.");
    }
  };

  const handleCreateStitchInfo = async (newStitchInfo: any) => {
    try {
      await axios.post("/api/admin/stitchInfo", newStitchInfo);
      toast.success("Stitch info created successfully.");
      fetchData();
      onCloseCreateStitch();
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Error creating stitch information.");
      } else {
        toast.error("Network error while creating stitch information.");
      }
    }
  };

  const handleCreateArticle = async (newArticle: any) => {
    try {
      await axios.post("/api/admin/articleinfo", newArticle);
      toast.success("Article created successfully.");
      fetchData();
      onCloseCreateArticle();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating article.");
    }
  };
  
  // const handleEditUser = async (updatedUser: any) => {
  //   try {
  //     //updatedUser.passwordHash = "test";
  //     await axios.put(`/api/Users/${updatedUser.id}`, updatedUser);
  //     toast.success("User updated successfully.");
  //     fetchData();
  //     setIsEditUserOpen(false);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };
  const handleEditUser = async (updatedUser: any) => {
    try {
        // Remove PasswordHash if it's null or undefined
        if (!updatedUser.passwordHash) {
            delete updatedUser.passwordHash;
        }

        await axios.put(`/api/Users/${updatedUser.id}`, updatedUser);
        toast.success("User updated successfully.");
        fetchData();
        setIsEditUserOpen(false);
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

  const handleEditStitchInfo = async (updatedStitchInfo: any) => {
    try {
      await axios.put(`/api/admin/stitchInfo/${updatedStitchInfo.id}`, updatedStitchInfo);
      toast.success("Stitch info updated successfully.");
      fetchData();
      setIsEditStitchOpen(false);
    } catch (error) {
      console.error("Error updating stitch information:", error);
    }
  };

  const handleEditContribution = async (updatedContribution: any) => {
    try {
      await axios.put(`/api/admin/contribution/${updatedContribution.id}`, updatedContribution);
      toast.success("Contribution updated successfully.");
      fetchData();
      setIsEditContributionOpen(false);
    } catch (error) {
      console.error("Error updating contribution:", error);
    }
  };

const handleEditArticle = async (updatedArticle: any) => {
  try {
    await axios.put(`/api/admin/articleinfo/${updatedArticle.id}`, updatedArticle);
    toast.success("Article updated successfully.");
    fetchData();
    setIsEditArticleOpen(false);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Error updating article.");
  }
};


  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`/api/Users/${id}`);
      toast.success("User deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteStitchInfo = async (id: number) => {
    try {
      await axios.delete(`/api/admin/stitchInfo/${id}`);
      toast.success("Stitch info deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Error deleting stitch information:", error);
    }
  };

  const handleDeleteContribution = async (id: number) => {
    try {
      await axios.delete(`/api/admin/contribution/${id}`);
      toast.success("Contribution deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Error deleting contribution:", error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await axios.delete(`/api/admin/articleinfo/${id}`);
      toast.success("Article deleted successfully.");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting article.");
    }
  };
  const handleCreateUnit = async (newUnit: any) => {
    try {
      await axios.post("/api/admin/unit", newUnit);
      toast.success("Unit created successfully.");
      fetchData();
      onCloseCreateUnit();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating unit.");
    }
  };

  // Handling unit editing
  const handleEditUnit = async (updatedUnit: any) => {
    try {
      await axios.put(`/api/admin/unit/${updatedUnit.id}`, updatedUnit);
      toast.success("Unit updated successfully.");
      fetchData();
      onCloseEditUnit();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating unit.");
    }
  };

  // Handling unit deletion
  const handleDeleteUnit = async (id: number) => {
    try {
      await axios.delete(`/api/admin/unit/${id}`);
      toast.success("Unit deleted successfully.");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting unit.");
    }
  };
  const openEditUserModal = (user: any) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const closeEditUserModal = () => {
    setSelectedUser(null);
    setIsEditUserOpen(false);
  };

  const openEditStitchModal = (stitchInfo: any) => {
    setSelectedStitchInfo(stitchInfo);
    setIsEditStitchOpen(true);
  };

  const closeEditStitchModal = () => {
    setSelectedStitchInfo(null);
    setIsEditStitchOpen(false);
  };

  const openEditContributionModal = (contribution: any) => {
    setSelectedContribution(contribution);
    setIsEditContributionOpen(true);
  };

  const closeEditContributionModal = () => {
    setSelectedContribution(null);
    setIsEditContributionOpen(false);
  };

  const openEditArticleModal = (article: any) => { 
    setSelectedArticle(article);
    setIsEditArticleOpen(true);
  };

  const closeEditArticleModal = () => {
    setSelectedArticle(null);
    setIsEditArticleOpen(false);
  };
  const openEditUnitModel = (unit: any) => {
    setSelectedUnit(unit);
    setIsEditUnitOpen(true);
   
  };
  const onCloseEditUnit = () => {
    setSelectedUnit(null);
    setIsEditUnitOpen(false);
  };
  const onCloseCreateUnit = () => {
    setSelectedUnit(null);
    setIsCreateUnitOpen(false);
  };
  const onOpenCreateUnit = () => {
    setIsCreateUnitOpen(true);
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 mt-[60px]">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Users Table</h3>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onPress={onOpenCreateUser}
            >
              Create New User
            </Button>
          </div>
          <UsersTable
            users={users}
            handleDeleteUser={handleDeleteUser}
            handleEditUser={openEditUserModal}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Stitch Infos Table</h3>
            <Button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onPress={onOpenCreateStitch}
            >
              Create New Stitch Info
            </Button>
          </div>
          <StitchInfosTable
            stitchInfos={stitchInfos}
            handleDeleteStitchInfo={handleDeleteStitchInfo}
            handleEditStitchInfo={openEditStitchModal}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Contributions Infos Table</h3>
            <Button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onPress={onOpenCreateContributionInfo}>
              Create New Contribution
            </Button>
          </div>
          <ContributionInfosTable
            contributionInfos={contributions}
            handleDeleteContributionInfo={handleDeleteContribution}
            handleEditContributionInfo={openEditContributionModal}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Articles Infos Table</h3>
            <Button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onPress={onOpenCreateArticle}>  
              Create New Article
            </Button>
          </div>
          <ArticleInfoTable
          articles ={articles}
            handleDeleteArticle={handleDeleteArticle}
            handleEditArticle={openEditArticleModal}
          />
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Units Table</h3>
            <Button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onPress={onOpenCreateUnit}
            >
              Create New Unit
            </Button>
          </div>
          <UnitsTable
            units={units}
            handleDeleteUnit={handleDeleteUnit}
            handleEditUnit={openEditUnitModel}
          />
      </div>

      </div>
      
        {/* Modals for Units */}
        <CreateUnitModal
          isOpen={isCreateUnitOpen}
          onClose={onCloseCreateUnit}
          handleCreateUnit={handleCreateUnit}
        />
       {selectedUnit && (
  <EditUnitModal
    isOpen={isEditUnitOpen}
    onClose={() => setIsEditUnitOpen(false)} 
    handleUpdateUnit={handleEditUnit} 
    unitToEdit={selectedUnit} 
  />
)}

      
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={onCloseCreateUser}
        handleCreateUser={handleCreateUser}
      />
      {selectedUser && (
        <EditUserModal
          isOpen={isEditUserOpen}
          onClose={closeEditUserModal}
          handleEditUser={handleEditUser}
          user={selectedUser}
        />
      )}
      <CreateStitchInfoModal
        isOpen={isCreateStitchOpen}
        onClose={onCloseCreateStitch}
        handleCreateStitchInfo={handleCreateStitchInfo}
      />
      {selectedStitchInfo && (
        <EditStitchInfoModal
          isOpen={isEditStitchOpen}
          onClose={closeEditStitchModal}
          handleEditStitchInfo={handleEditStitchInfo}
          stitchInfo={selectedStitchInfo}
        />
      )}
      <CreateContributionInfoModal
        isOpen={isCreateContributionOpen}
        onClose={onCloseCreateContribution}
        handleCreateContributionInfo={handleCreateContribution}
        stitchInfos = {stitchInfos}
      />
     {selectedContribution && (
  <EditContributionInfoModal
    isOpen={isEditContributionOpen}
    onClose={closeEditContributionModal}
    handleEditContributionInfo={handleEditContribution}
    contribution={selectedContribution}
    stitchInfos={stitchInfos} 
  />
)}

      <CreateArticleInfoModal
        isOpen={isCreateArticleOpen}
        onClose={onCloseCreateArticle}
        handleCreateArticleInfo={handleCreateArticle}
      />
   {selectedArticle && (
  <EditArticleInfoModal
    isOpen={isEditArticleOpen}
    onClose={closeEditArticleModal}
    handleEditArticle={handleEditArticle}
    article={selectedArticle}
  />
)}
    </>                                                                           
  );
};

export default AdminComponent;
