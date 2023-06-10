import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/user/get', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.post(
        'http://localhost:8081/user/update',
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = !currentStatus;
    updateUserStatus(id, newStatus);
    // Update the local state
    setUsers(prevUsers =>
      prevUsers.map(user => (user.id === id ? { ...user, status: newStatus } : user))
    );
  };

  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Search Filter</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.contactNumber}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.status}
                    onChange={() => handleToggle(user.id, user.status)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     getUsers();
//   }, []);

//   // Fetch users data from the API
//   const getUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:8081/user/get', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
//         },
//       });
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Handle search query change
//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//     filterUsers(event.target.value);
//   };

//   // Filter users based on search query
//   const filterUsers = (query) => {
//     const filtered = users.filter((user) =>
//       user.name.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   };

//   // Handle toggle button change
//   const handleToggleChange = async (userId, status) => {
//     try {
//       const updatedUser = { id: userId, status: status ? 'true' : 'false' };
//       await axios.post('http://localhost:8081/user/update', updatedUser, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
//         },
//       });
//       // Update the users list with the updated user status
//       const updatedUsers = users.map((user) =>
//         user.id === userId ? { ...user, status: updatedUser.status } : user
//       );
//       setUsers(updatedUsers);
//       setFilteredUsers(updatedUsers);
//     } catch (error) {
//       console.error('Error updating user status:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="card">
//         <div className="card-header">Search Filter</div>
//         <div className="card-body">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by name"
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//       </div>

//       <table className="table mt-4">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Contact Number</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.email}</td>
//               <td>{user.contactNumber}</td>
//               <td>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={user.status === 'true'}
//                     onChange={(e) =>
//                       handleToggleChange(user.id, e.target.checked)
//                     }
//                   />
//                   <span className="slider round"></span>
//                 </label>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageUsers;
