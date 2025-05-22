const fetchUsersTest = async () => {
    try {
      const response = await axios.get(dataBaseURL);
      console.log(response.data.data)
      setUser(response.data.data);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
<button onClick={fetchUsersTest}>Restrive data clg</button> 