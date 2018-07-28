/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*jslint node: true, vars: true */
/*global WASDObj, gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict"; 
var kWASDDelta = 2;
var cnt = 0;

function Hero(spriteTexture, atX, atY, w, h,top) {
    
    this.mHero = new SpriteAnimateRenderable(spriteTexture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(atX, atY);
    this.mHero.getXform().setSize(w, h);
    this.mHero.setSpriteSequence(top,0,150,150,2,0);
    this.mHero.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mHero.setAnimationSpeed(10);
    this.setBoundRadius(w/2);
    this.mWidth=w;
    this.mHeight=h;
    
    GameObject.call(this, this.mHero);
    var r;
    r = new RigidRectangle(this.getXform(), w, h);
    r.setInertia(0);
    r.setRestitution(0);
    this.setRigidBody(r);
    //this.toggleDrawRenderable();
    //this.toggleDrawRigidShape();
    
    
    //used for StartScene automove 
     this.count=0;
     this.autodelta =kWASDDelta;
}

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.keyControl = function (PlatformSet1,SpringSet2) {
    var xform = this.getXform();
    this.ObjectSet1=PlatformSet1;
    this.ObjectSet2=SpringSet2;
    var flag=0;//0 for no collision
    var i;
    if(this.ObjectSet1!==null){
        for(i=1;i<this.ObjectSet1.size();i++){
        var ObjectPos=this.ObjectSet1.getObjectAt(i).getXform();
        if((this.getXform().getYPos()-this.mHeight/2)<=(ObjectPos.getYPos()+ObjectPos.getHeight()/2)
            &&(this.getXform().getXPos()+this.mWidth/2)>(ObjectPos.getXPos()-ObjectPos.getWidth()/2)
            &&(this.getXform().getXPos()-this.mWidth/2)<(ObjectPos.getXPos()+ObjectPos.getWidth()/2)
            &&(this.getXform().getYPos()+this.mHeight/2)>(ObjectPos.getYPos()-ObjectPos.getHeight()/2)){
            flag=1;
        }
    }
    }
    if(this.ObjectSet2!==null&&flag===0){
        for(i=0;i<this.ObjectSet2.size();i++){
        var ObjectPos=this.ObjectSet2.getObjectAt(i).getXform();
        if((this.getXform().getYPos()-this.mHeight/2)<=(ObjectPos.getYPos()+ObjectPos.getHeight()/2)
            &&(this.getXform().getXPos()+this.mWidth/2)>=(ObjectPos.getXPos()-ObjectPos.getWidth()/2)
            &&(this.getXform().getXPos()-this.mWidth/2)<=(ObjectPos.getXPos()+ObjectPos.getWidth()/2)
            &&(this.getXform().getYPos()+this.mHeight/2)>=(ObjectPos.getYPos()-ObjectPos.getHeight()/2)){
                flag=1;
            }
        }
    }
   
    if(flag===1){
        cnt=0;
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        if(cnt === 0){
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0],300);
        }     
         if(cnt === 1){
                this.getRigidBody().setVelocity(this.getRigidBody().getVelocity()[0],300);
        }   
        cnt++;
        console.log(this.getRigidBody().getVelocity()[1]);
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        this.mHero.setposition(422,0);
        this.mHero.updateAnimation();
        xform.incXPosBy(-kWASDDelta);
        
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        this.mHero.setposition(1024,0);
        this.mHero.updateAnimation();
        xform.incXPosBy(kWASDDelta);
    }
    
    this.getRigidBody().userSetsState();
    
    
};

Hero.prototype.update = function () {
    GameObject.prototype.update.call(this);
};

Hero.prototype.updateChaser = function (set) {
    GameObject.prototype.update.call(this);
    var i, obj;
    var heroBounds = this.getBBox();
    var p = this.getXform().getPosition();
    for (i=0; i<set.size(); i++) {
        obj = set.getObjectAt(i);
        obj.rotateObjPointTo(p, 0.8);
        if (obj.getBBox().intersectsBound(heroBounds)) {
            gEngine.GameLoop.stop();
        }
    }
};

Hero.prototype.CheckUpdate_Platform=function(Object,dir,rate){
    this.mObject=Object;
    this.mDir=dir;//0 for x; 1 for y
    this.mRate=rate;
    var flag=0;//0 for no collision
    this.mObjectPos=this.mObject.getXform();
    
    if((this.getXform().getYPos()-this.mHeight/2)<=(this.mObjectPos.getYPos()+this.mObjectPos.getHeight()/2)
            &&(this.getXform().getXPos()+this.mWidth/2)>(this.mObjectPos.getXPos()-this.mObjectPos.getWidth()/2)
            &&(this.getXform().getXPos()-this.mWidth/2)<(this.mObjectPos.getXPos()+this.mObjectPos.getWidth()/2)
            &&(this.getXform().getYPos()+this.mHeight/2)>=(this.mObjectPos.getYPos()-this.mObjectPos.getHeight()/2)){
        flag=1;
    }
    //console.log(flag);
    if(flag===1&&this.mDir===0){
        this.getXform().incXPosBy(this.mRate);
    }
    if(flag===1&&this.mDir===1){
        this.getXform().incYPosBy(this.mRate);
    }
};
Hero.prototype.CheckUpdate_Collision=function(){
    
};
Hero.prototype.StartSceneautomove= function(){

    if(this.count<=120){
        this.getXform().incXPosBy(this.autodelta);
        if(this.autodelta>0){
            this.mHero.setposition(1024,0);
        }
        else{
            this.mHero.setposition(424,0);
        }
        this.mHero.updateAnimation();
        this.count=this.count+1;
    }
    else{
        this.count =0;
        this.autodelta = -this.autodelta ;
    }
};
