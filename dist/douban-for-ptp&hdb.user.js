// ==UserScript==
// @name         Douban-Info-for-PTP&HDB
// @namespace    https://github.com/techmovie/Douban-Info-for-PTP
// @version      0.5.4
// @description  在ptp和hdb电影详情页展示部分中文信息
// @author       birdplane
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://hdbits.org/details.php?id=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @note         2021-01-12 支持hdb剧集
// @note         2021-01-24 修改豆瓣评分样式
// ==/UserScript==
(()=>{var x=GM_addStyle(`
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
`);var a="https://omit.mkrobot.org/movie/infos",p="https://movie.douban.com/j/subject_suggest",l={PTP:"passthepopcorn.me",HDB:"hdbits.org"},c=()=>{let t=location.host,e="";try{return Object.keys(l).forEach(i=>{let r=l[i];r&&r===t&&(e=i)}),e}catch(i){i.message!=="end loop"&&console.log(i)}},o=c(),s=o==="HDB"&&!!$(".showlinks")[0],n=null;o==="PTP"&&(n=$("#imdb-title-link").attr("href"));o==="HDB"&&!s&&(n=$(".contentlayout h1 a").attr("href"));s&&(n=$("#details .showlinks li").eq(1).find("a").attr("href"));var g=/tt\d+/.exec(n)[0];GM_xmlhttpRequest({method:"GET",url:`${p}?q=${g}`,onload(t){let e=JSON.parse(t.responseText);if(e.length>0){let i=e[0].id;s?f(i):v(i)}}});var f=t=>{GM_xmlhttpRequest({url:`${a}/${t}`,onload(e){let i=JSON.parse(e.responseText);d(i.data)}})},v=t=>{GM_xmlhttpRequest({url:`${a}/${t}`,onload(e){let i=JSON.parse(e.responseText);console.log(i),o==="PTP"&&m(i.data),o==="HDB"&&d(i.data)}})},d=t=>{let e=`
        <tr>
            <td>
                <div id="l7829483" class="label collapsable" onclick="showHideEl(7829483);(7829483)"><span class="plusminus">- </span>\u8C46\u74E3\u4FE1\u606F</div>
                <div id="c7829483" class="hideablecontent" >
                    <div class="contentlayout  douban-info">
                        <div class="poster" style="margin-right: 10px;max-width: 300px;">
                            <image src="${t.image}" style="width: 100%;">
                        </div>
                        <div class="detail">
                            <div class="title">
                                <a  target='_blank' href="${t.link}">${t.title}  (${t.year}) </a>
                            </div>
                            <div style="font-size: 0;min-width: 105px;margin-bottom: 20px;">
                                <span class="icon-pt1" >\u8C46</span>
                                <span class="icon-pt2">\u8C46\u74E3\u8BC4\u5206</span>
                                <span style="font-size: 18px;font-weight:600;margin-left:10px;">${t.average}</span>
                                <span style="font-size: 14px;">&nbsp;(${t.votes} votes)</span>
                            </div>
                            <div class="movie-detail">
                                <div class="synopsis">
                                    ${t.summary||"\u6682\u65E0\u7B80\u4ECB"}
                                </div>
                                <div class="movieinfo">
                                    <div class="panel">
                                        <div class="panel__body">
                                            <div><strong>\u5BFC\u6F14:</strong> ${t.director}</div>
                                            <div><strong>\u7C7B\u578B:</strong> ${t.genre}</div>
                                            <div><strong>\u5236\u7247\u56FD\u5BB6/\u5730\u533A:</strong> ${t.region}</div>
                                            <div><strong>\u8BED\u8A00:</strong> ${t.language}</div>
                                            <div><strong>\u65F6\u957F:</strong> ${t.runtime}</div>
                                            <div><strong>\u53C8\u540D:</strong>  ${t.aka}</div
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>`;s?$("#details>tbody>tr").eq(2).before(e):$("#details>tbody>tr").eq(1).before(e)},m=t=>{if(b(t.title)&&$(".page__title").prepend(`<a target='_blank' href="${t.link}">[${t.title}] </a>`),t.summary){let e=$("#synopsis-and-trailer").clone().attr("id","");e.find("#toggletrailer").empty(),e.find(".panel__heading__title").text("\u4E2D\u6587\u7B80\u4ECB"),e.find("#synopsis").text(t.summary).attr("id",""),$("#synopsis-and-trailer").after(e)}$("#movieinfo").before(`
    <div class="panel">
    <div class="panel__heading"><span class="panel__heading__title">\u7535\u5F71\u4FE1\u606F</span></div>
    <div class="panel__body">
    <div><strong>\u5BFC\u6F14:</strong> ${t.director}</div>
    <div><strong>\u7C7B\u578B:</strong> ${t.genre}</div>
    <div><strong>\u5236\u7247\u56FD\u5BB6/\u5730\u533A:</strong> ${t.region}</div>
    <div><strong>\u8BED\u8A00:</strong> ${t.language}</div>
    <div><strong>\u65F6\u957F:</strong> ${t.runtime}</div>
    <div><strong>\u53C8\u540D:</strong>  ${t.aka}</div
    </div>`),t.average&&$("#movie-ratings-table tr").prepend(`<td colspan="1" style="width: 152px;">
    <center>
    <a target="_blank" class="rating" href="${t.link}" rel="noreferrer">
    <div style="font-size: 0;min-width: 105px;">
        <span class="icon-pt1">\u8C46</span>
        <span class="icon-pt2">\u8C46\u74E3\u8BC4\u5206</span>
    </div>
    </a>
    </center>
    </td>
    <td style="width: 153px;">
    <span class="rating">${t.average}</span>
    <span class="mid">/</span>
    <span class="outof"> 10</span>
    <br>(${t.votes} votes)</td>`)},b=t=>/[\u4e00-\u9fa5]+/.test(t);})();
