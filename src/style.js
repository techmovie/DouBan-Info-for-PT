export default GM_addStyle(`
.contentlayout.douban-info {
    display: flex;
    justify-content: space-around;
}
.contentlayout.douban-info .detail{
    flex:1;
}
.detail .title{
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 20px;
}
.detail .title a{
    text-decoration: none;
}
.movie-detail{
    display: flex;
    justify-content: space-between;
}
.movie-detail .synopsis {
    width: 60%;
}
.movie-detail .movieinfo {
    margin-right: 20px;
    max-width: 30%;
}
.icon-pt1{
    font-size: 14px;
    display: inline-block;
    text-align: center;
    border: 1px solid #41be57;
    background-color: #41be57;
    color: white;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 24px;
    height: 24px;
    line-height: 24px;
}

.icon-pt2{
    display: inline-block;
    text-align: center;
    border: 1px solid #41be57;
    color: #3ba94d;
    background: #ffffff;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 69px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
}
.cast-empty{
    background-image: url(GM.getResourceUrl("emptyIcon")); width: auto;
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: hidden;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #dbdbdb;
    box-sizing: border-box;
    background-size: 50%;
    text-overflow: ellipsis;
}
.cast-item{
    margin-top: 10px;
    margin-bottom: 10px;
    flex-shrink: 0;
    display: inline-block;
    margin-left: 10px;
    margin-right: 4px;
    width: 138px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
    border-radius: 6px;
    overflow: hidden;
}
.cast-item-image{
    width: 138px;
    height: 175px;
    display:block;
    overflow: hidden;
}
.cast-item .actor-name{
    color: #000;
    font-weight: bold;
    padding: 10px 10px 0;
}
`);
