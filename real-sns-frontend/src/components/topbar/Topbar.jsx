import React from "react";
import { Search, Chat, Notifications } from "@mui/icons-material";
import "./Topbar.css";

export default function Topbar() {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Like SNS</span>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="探しものは？"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIconItems">
          <div className="topbarIconitem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconitem">
            <Notifications />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconitem"></div>
          <img src="/assets/person/1.jpeg" alt="" className="topbarImg" />
        </div>
      </div>
    </div>
  );
}
