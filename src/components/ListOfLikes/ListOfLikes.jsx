import React, { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import BusinessIcon from '@mui/icons-material/Business'; // Company icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import EventIcon from '@mui/icons-material/Event'; // Publication date icon
import FavoriteIcon from '@mui/icons-material/Favorite'; // Liked date icon
import DescriptionIcon from '@mui/icons-material/Description'; // Summary icon
import CircularProgress from '@mui/material/CircularProgress'; // Spinner
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon
import IconButton from '@mui/material/IconButton'; // IconButton for clickable icons
import './ListOfLikes.css';

const ListOfLikes = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [page, setPage] = useState(0); // Pagination: current page
  const rowsPerPage = 2; // Rows per page is fixed at 2
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userId = sessionStorage.getItem("user_id");

  // Function to render list items from text
  const renderList = (text) => {
    const items = text.split('-').filter(item => item.trim() !== '');
    return items.map((item, idx) => (
      <li key={idx} className="job-list-item">{item.trim()}</li>
    ));
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/history/get-liked-posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setLikedPosts(data.liked_posts || []);
        } else {
          console.error('Failed to fetch liked posts');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchLikedPosts();
  }, [baseUrl, userId]);

  // Handle removing a liked post
  const handleRemoveLike = async (postToRemove) => {
    try {
      const response = await fetch(`${baseUrl}/history/remove-liked-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          job_post_url: postToRemove.Url, 
        }),
      });

      if (response.ok) {
        // Update the state to remove the post from the list
        setLikedPosts((prevPosts) =>
          prevPosts.filter((post) => post.Url !== postToRemove.Url)
        );
        console.log('Successfully removed liked post');
      } else {
        console.error('Failed to remove liked post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Slicing the data for the current page
  const currentPosts = likedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    // While loading, display the spinner
    return (
      <div className="spinner-container">
        <CircularProgress sx={{ color: '#171C3F' }} />
      </div>
    );
  }

  // After loading, render the component
  return (
    <div className="prefix-container4">
      {likedPosts.length > 0 ? (
        <>
          {/* Title is displayed only if there are liked posts */}
          <h2 className="prefix-h2">Liked Job Posts :</h2>
          {currentPosts.map((post, index) => {
            const jobDescription = post.Summary || 'N/A';
            const primaryResponsibilities = jobDescription.match(/\*\*Primary Responsibilities:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';
            const keySkills = jobDescription.match(/\*\*Key Required Skills:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';
            const mainObjectives = jobDescription.match(/\*\*Main Objectives:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';

            return (
              <div key={index} className="job-details-container">
                {/* Delete icon positioned on the right */}
                <IconButton
                  aria-label="remove like"
                  onClick={() => handleRemoveLike(post)}
                  sx={{ color: '#171C3F', float: 'right' }}
                >
                  <DeleteIcon />
                </IconButton>
                <div className="job-title-like-container">
                  <h3 className="job-title">{post.Title}</h3>
                  <a
                    href={post.Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prefix-MuiButton-contained"
                  >
                    View Job
                  </a>
                </div>
                <p className="job-section">
                  <BusinessIcon sx={{ color: "#171C3F" }} /> {post.Company}
                </p>
                <p className="job-section">
                  <LocationOnIcon sx={{ color: "#171C3F" }} /> {post.Location}
                </p>
                <p className="job-section">
                  <EventIcon sx={{ color: "#171C3F" }} /> {post['Publication Date']}
                </p>
                <p className="job-section">
                  <FavoriteIcon sx={{ color: "#171C3F" }} /> {post.added_date}
                </p>

                <div className="job-section">
                  <DescriptionIcon sx={{ color: "#171C3F" }} /> Primary Responsibilities:
                  <ul>{renderList(primaryResponsibilities)}</ul>
                </div>
                <div className="job-section">
                  <DescriptionIcon sx={{ color: "#171C3F" }} /> Key Required Skills:
                  <ul>{renderList(keySkills)}</ul>
                </div>
                <div className="job-section">
                  <DescriptionIcon sx={{ color: "#171C3F" }} /> Main Objectives:
                  <ul>{renderList(mainObjectives)}</ul>
                </div>
              </div>
            );
          })}
          {/* Pagination is displayed only if there are liked posts */}
          <TablePagination
            component="div"
            count={likedPosts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}  // Disable rows per page dropdown
            labelRowsPerPage={null}  // Hide "Rows per page" label
            showFirstButton={false}  // Hide first page button
            showLastButton={false}   // Hide last page button
            nextIconButtonProps={{
              "aria-label": "Next Page",
              sx: { color: "#171C3F", fontWeight: "bold" },
            }}
            backIconButtonProps={{
              "aria-label": "Previous Page",
              sx: { color: "#171C3F", fontWeight: "bold" },
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 1,
              color: "#171C3F",
              fontWeight: "bolder",
              "& .MuiTablePagination-displayedRows": {
                color: "red",
                fontWeight: "bold",
              },
            }}
          />
        </>
      ) : (
        // Message displayed when there are no liked posts
        <p className='nolikedPosts'>
          There are currently no posts available for display.<br />
          Please engage with posts in the manual matching section to enable viewing.
        </p>
      )}
    </div>
  );
};

export default ListOfLikes;
