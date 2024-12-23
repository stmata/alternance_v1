import { Box, Typography } from "@mui/material";
import "./JobDetails.css"; // Import the CSS file for custom styles
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

const JobDetails = ({ selectedJob }) => {
  const { t, i18n } = useTranslation(); // Only use `t` for translations
  const language = i18n.language;
  const jobDescription =
    language === "fr" ? selectedJob.Summary_fr : selectedJob.Summary || "N/A";
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const jobTitleLabel = t("job_title");
  const primaryResponsibilitiesLabel = t("primary_responsibilities");
  const keySkillsLabel = t("key_skills");
  const mainObjectivesLabel = t("main_objectives");
  const niveau_experiencesLabel = t("niveau_experiences");

  const jobTitle =
    jobDescription.match(
      new RegExp(`\\*\\*${jobTitleLabel}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`)
    )?.[1] || t("no_more_details");
  const primaryResponsibilities =
    jobDescription.match(
      new RegExp(
        `\\*\\*${primaryResponsibilitiesLabel}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`
      )
    )?.[1] || t("no_more_details");
  const keySkills =
    jobDescription.match(
      new RegExp(`\\*\\*${keySkillsLabel}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`)
    )?.[1] || t("no_more_details");
  const mainObjectives =
    jobDescription.match(
      new RegExp(`\\*\\*${mainObjectivesLabel}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`)
    )?.[1] || t("no_more_details");
  const niveau_experiences =
    jobDescription.match(
      new RegExp(`\\*\\*${niveau_experiencesLabel}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`)
    )?.[1] || t("no_more_details");
  const [likedRows, setLikedRows] = useState({}); // Store the like state for each post based on the unique identifier
  const userId = sessionStorage.getItem("user_id");

  // Use job.Url as the unique identifier
  const generateUniqueId = (job) => {
    return job.Url;
  };

  const currentJobId = generateUniqueId(selectedJob); // Generate ID for the current job

  // Fetch liked posts from the backend to check if this job is already liked
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/history/get-liked-posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const likedPostsFromDb = data.liked_posts || [];

          // Build an object with the unique identifier as keys and true as the value for liked ones
          const likedObj = likedPostsFromDb.reduce((acc, likedPost) => {
            const uniqueId = generateUniqueId(likedPost);
            acc[uniqueId] = true;
            return acc;
          }, {});

          // Store the liked posts in `likedRows` state
          setLikedRows(likedObj);
        } else {
          console.error("Failed to fetch liked posts");
        }
      } catch (error) {
        console.error("Error fetching liked posts", error);
      }
    };

    fetchLikedPosts();
  }, [baseUrl, userId]);

  // Handle liking and unliking the job
  const handleLikeClick = (job) => {
    const jobId = generateUniqueId(job); // Use the unique identifier for this job

    if (likedRows[jobId]) {
      // Job is already liked, so unlike it
      setLikedRows((prevState) => ({
        ...prevState,
        [jobId]: false, // Set this specific job as unliked
      }));

      // Send the unlike status to the backend
      fetch(`${baseUrl}/history/remove-liked-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_post_url: job.Url,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Unliked successfully", data);
        })
        .catch((error) => {
          console.error("Error unliking the job", error);
        });
    } else {
      // Job is not liked, so like it
      // Set the job as liked in the state
      setLikedRows((prevState) => ({
        ...prevState,
        [jobId]: true, // Set this specific job as liked
      }));
      console.log(job);

      // Send the like status to the backend
      fetch(`${baseUrl}/history/add-liked-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_post: job, // Send job details
        }),
        
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Liked successfully", data);
        })
        .catch((error) => {
          console.error("Error liking the job", error);
        });
    }
  };

  const renderList = (content) => {
    return content
      .split("-")
      .filter((item) => item.trim() !== "")
      .map((item, index) => (
        <li key={index} className="job-list-item">
          {item.trim()}
        </li>
      ));
  };

  return (
    <Box className="job-details-container">
      {/* Wrapper for title and like icon */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" className="job-title">
          {jobTitle}
        </Typography>

        <Box>
          {/* Add onClick handler to both icons to allow toggling */}
          {likedRows[currentJobId] ? (
            <Favorite
              sx={{ color: "red", fontSize: "30px", cursor: "pointer" }}
              onClick={() => handleLikeClick(selectedJob)} // Handle unlike action
            />
          ) : (
            <FavoriteBorder
              sx={{ color: "#FFD700", fontSize: "30px", cursor: "pointer" }}
              onClick={() => handleLikeClick(selectedJob)} // Handle like action
            />
          )}
        </Box>
      </Box>

      <br />
      <Box>
  <strong>{t("title_PR")}</strong>
  <ul>{renderList(primaryResponsibilities)}</ul>
</Box>

<Box>
  <strong>{t("title_KRS")}</strong>
  <ul>{renderList(keySkills)}</ul>
</Box>

<Box>
  <strong>{t("title_MO")}</strong>
  <ul>{renderList(mainObjectives)}</ul>
</Box>

<Box>
  <strong>{t("title_LEVELEXP")}</strong>
  <ul>{renderList(niveau_experiences)}</ul>
</Box>

    </Box>
  );
};

export default JobDetails;
