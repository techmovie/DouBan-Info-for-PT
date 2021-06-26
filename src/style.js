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
.douban-dom {
    display: flex;
    cursor: pointer;
}
.douban-dom {
    text-align: left;
}
#douban-wrapper *{
    box-sizing: content-box;
}
#douban-wrapper .clearfix:after { 
    content: "."; 
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
}
#douban-wrapper .clearfix {
    zoom: 1;
    display: inline-block; 
    _height: 1px;
}
#douban-wrapper  .clearfix { 
    height: 1% 
}
#douban-wrapper .clearfix { 
    display: block 
}
#douban-wrapper .rating_per{
    color: #111;
}
#douban-wrapper .grid{
    overflow: initial;
}
.content-rounded #douban-wrapper div{
    margin-left: 0;
}
#douban-wrapper #content .douban-icon .icon-pt1 {
    background-image:none;
}
#douban-wrapper h2,#douban-wrapper h1{
    border:none;
    background-image: none;
    background-color: transparent;
    text-shadow: none;
}
#douban-wrapper .grid-col5 {
    font-size: 14px;
    padding: 27px 14px 0 12px;
    width: 190px;
    overflow-y: auto;
    height: 277px;
    width: calc(100% - 225px - 254px - 36px - 280px);
}

#douban-wrapper .summary{
    padding-top: 10px;
    color: #000000;
    line-height: 25px;
    letter-spacing: 1px;
    word-break: break-all;
    font-weight: 400;
}
#douban-wrapper {
    width: 100% !important;
}
.douban-dom>div{
    width: 100%;
}
#douban-wrapper #content{
    background-image:none !important;
    background: #fff;
    width: calc(100% - 20px) !important;
}
#douban-wrapper #content .grid{
    width: 100% !important;
}
.bhd #douban-wrapper ::-webkit-scrollbar-track{
    background-color: #fff;
}
.bhd #douban-wrapper ::-webkit-scrollbar-thumb{
    background-color: #ddd;
}
.btn #douban-wrapper .grid-col1 {
    display: none;
}
.hdb #douban-wrapper .grid-col1 {
    display: none;
}
.hdt #douban-wrapper .grid-col1 {
    display: none;
}
.btn #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.hdt #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
.hdb #douban-wrapper .grid-col5 {
    width: calc(100% - 254px - 36px - 280px);
}
`);
