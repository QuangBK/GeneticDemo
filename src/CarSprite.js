/**
 * Created by Administrator on 1/3/2016.
 */
var CarSprite = cc.Node.extend({
    sprite:null,
    point1:null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor:function (x,y) {
        this._super();
        // init coin animation
        this.x = x;
        this.y = y;
        this.sprite = new cc.DrawNode();
        this.sprite.clear();
        //cc.p(pos.x -this.size,pos.y - this.size)
        this.point1 = cc.p(0,0);
        this.sprite.drawSegment(this.point1, cc.p(0,100), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(30*Math.PI/180), 100*Math.cos(30*Math.PI/180)), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(60*Math.PI/180), 100*Math.cos(60*Math.PI/180)), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(90*Math.PI/180), 100*Math.cos(90*Math.PI/180)), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(-30*Math.PI/180), 100*Math.cos(-30*Math.PI/180)), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(-60*Math.PI/180), 100*Math.cos(-60*Math.PI/180)), 1, cc.color.WHITE);
        this.sprite.drawSegment(this.point1, cc.p(100*Math.sin(-90*Math.PI/180), 100*Math.cos(-90*Math.PI/180)), 1, cc.color.WHITE);
        this.addChild(this.sprite,1);

        this.sprite = new cc.Sprite(res.carPicture);
        this.sprite.attr({
            x: 0,
            y: 0,
            scale: 0.15,
            rotation: 0
        });
        this.addChild(this.sprite, 0);

        this.init();
        //this.scheduleUpdate();
    },
    init:function(){
        //this._super();
        //this.scheduleUpdate();
    },
    removeFromParent:function () {
        this.sprite.removeFromParent();
        this.sprite = null;
    },
    update:function (dt) {
    }
});