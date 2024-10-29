<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <head-bar :title="headTitle"/>
          <v-img src="./package.png"
                 style="left: 2%; bottom: 10%; position: absolute;"></v-img>
<!--            <v-row class="m-0">-->
<!--              <v-card-->
<!--                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">-->
<!--                <v-card-->
<!--                  style="left: 30%; top: -15%; position: absolute; background: #70B183; border-radius: 100px"-->
<!--                  class="p-3">-->
<!--                  <v-icon size="87" dark>mdi-storefront-outline</v-icon>-->
<!--                </v-card>-->
<!--                <h4 style="color: #70B183; font-weight: 700; padding-top: 70px" class="mb-3">-->
<!--                  แพ็คเกจระดับทดลองใช้-->
<!--                </h4>-->
<!--                <h5 style="color: #686868; font-weight: 400;">-->
<!--                  เหมาะสำหรับร้านค้าเดี่ยว และ-->
<!--                </h5>-->
<!--                <h5 style="color: #686868; font-weight: 400;" class="mb-7">-->
<!--                  ผู้ที่พึ่งเริ่มใช้งานระบบ-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบแคชเชียร์-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบจัดการร้านค้าหลังบ้าน-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ใช้ได้ 5 ผู้ใช้งานในระบบ-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">-->
<!--                  - พื้นที่เก็บข้อมูล 10 G-->
<!--                </h5>-->
<!--                <h2 style="color: #846537; font-weight: 700;" class="text-left">-->
<!--                  ฟรี-->
<!--                </h2>-->
<!--              </v-card>-->
<!--              <v-card-->
<!--                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">-->
<!--                <v-card-->
<!--                  style="left: 30%; top: -15%; position: absolute; background: #48B4E3; border-radius: 100px"-->
<!--                  class="p-3">-->
<!--                  <v-icon size="87" dark>mdi-home-assistant</v-icon>-->
<!--                </v-card>-->
<!--                <h4 style="color: #195A77; font-weight: 700; padding-top: 70px" class="mb-3">-->
<!--                  แพ็คเกจทั่วไป-->
<!--                </h4>-->
<!--                <h5 style="color: #686868; font-weight: 400;">-->
<!--                  เหมาะสำหรับร้านค้าเดี่ยว และ-->
<!--                </h5>-->
<!--                <h5 style="color: #686868; font-weight: 400;" class="mb-7">-->
<!--                  ผู้ที่พึ่งเริ่มใช้งานระบบ-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบแคชเชียร์-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบจัดการร้านค้าหลังบ้าน-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ใช้ได้ 5 ผู้ใช้งานในระบบ-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">-->
<!--                  - พื้นที่เก็บข้อมูล 10 G-->
<!--                </h5>-->
<!--                <h2 style="color: #846537; font-weight: 700;" class="text-left">-->
<!--                  ติดต่อเจ้าหน้าที่-->
<!--                </h2>-->
<!--              </v-card>-->
<!--              <v-card-->
<!--                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">-->
<!--                <v-card-->
<!--                  style="left: 30%; top: -15%; position: absolute; background: #906EC5; border-radius: 100px"-->
<!--                  class="p-3">-->
<!--                  <v-icon size="87" dark>mdi-home-city-outline</v-icon>-->
<!--                </v-card>-->
<!--                <h4 style="color: #5C3D8D; font-weight: 700; padding-top: 70px" class="mb-3">-->
<!--                  แพ็คเกจระดับสูง-->
<!--                </h4>-->
<!--                <h5 style="color: #686868; font-weight: 400;" class="mb-7">-->
<!--                  เหมาะสำหรับร้านค้าที่ต้องการแยกใช้งานเป็นของส่วนตัว-->
<!--                </h5>-->

<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบแคชเชียร์-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ระบบจัดการร้านค้าหลังบ้าน-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left">-->
<!--                  - ใช้ได้ 5 ผู้ใช้งานในระบบ-->
<!--                </h5>-->
<!--                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">-->
<!--                  - พื้นที่เก็บข้อมูล 10 G-->
<!--                </h5>-->
<!--                <h2 style="color: #846537; font-weight: 700;" class="text-left">-->
<!--                  ติดต่อเจ้าหน้าที่-->
<!--                </h2>-->
<!--              </v-card>-->
<!--            </v-row>-->

<!--          <div class="card">-->
            <Carousel :value="products" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions" >
<!--              <template #header>-->
<!--                <h5>Basic</h5>-->
<!--              </template>-->
              <template #item="slotProps">
                <div class="pt-8">
                <v-card style="width: 320px; border-radius: 15px; height: 100%;" class="p-3">
                  <v-card
                    style="left: 37%; right: 37%; top: 0%; position: absolute; background: #70B183; border-radius: 100px;"
                    class="p-3">
                    <v-icon size="50" dark>mdi-storefront-outline</v-icon>
                  </v-card>
                  <h4 style="color: #70B183; font-weight: 700; padding-top: 70px" class="mb-3">
                    แพ็คเกจระดับทดลองใช้
                  </h4>
                  <h5 style="color: #686868; font-weight: 400;">
                    เหมาะสำหรับร้านค้าเดี่ยว และ
                  </h5>
                  <h5 style="color: #686868; font-weight: 400;" class="mb-7">
                    ผู้ที่พึ่งเริ่มใช้งานระบบ
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ระบบแคชเชียร์
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ระบบจัดการร้านค้าหลังบ้าน
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ใช้ได้ 5 ผู้ใช้งานในระบบ
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">
                    - พื้นที่เก็บข้อมูล 10 G
                  </h5>
                  <h5 style="color: #686868; font-weight: 400;">
                    เหมาะสำหรับร้านค้าเดี่ยว และ
                  </h5>
                  <h5 style="color: #686868; font-weight: 400;" class="mb-7">
                    ผู้ที่พึ่งเริ่มใช้งานระบบ
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ระบบแคชเชียร์
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ระบบจัดการร้านค้าหลังบ้าน
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left">
                    - ใช้ได้ 5 ผู้ใช้งานในระบบ
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">
                    - พื้นที่เก็บข้อมูล 10 G
                  </h5>
                  <h2 class="text-left" style="color: #846537; font-weight: 700;">
                    <s style="color: gray; font-size: 20px">฿199.-</s>
                    ฿99.-
                  </h2>
                </v-card>
                </div>

<!--                <div class="product-item">-->
<!--                  <div class="product-item-content">-->
<!--                    <div class="mb-3">-->
<!--                      <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="product-image" />-->
<!--                    </div>-->
<!--                    <div>-->
<!--                      <h4 class="mb-1">{{slotProps.data.name}}</h4>-->
<!--                      <h6 class="mt-0 mb-3">${{slotProps.data.price}}</h6>-->
<!--&lt;!&ndash;                      <span :class="'product-badge status-'+slotProps.data.inventoryStatus.toLowerCase()">{{slotProps.data.inventoryStatus}}</span>&ndash;&gt;-->
<!--                      <div class="car-buttons mt-5">-->
<!--                        <Button icon="pi pi-search" class="p-button p-button-rounded mr-2" />-->
<!--                        <Button icon="pi pi-star-fill" class="p-button-success p-button-rounded mr-2" />-->
<!--                        <Button icon="pi pi-cog" class="p-button-help p-button-rounded" />-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
              </template>
            </Carousel>
<!--          </div>-->
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
s, strike{text-decoration:none;position:relative;}
s::before, strike::before {
  top: 50%; /*tweak this to adjust the vertical position if it's off a bit due to your font family */
  background:red; /*this is the color of the line*/
  opacity:.7;
  content: '';
  width: 110%;
  position: absolute;
  height:.1em;
  border-radius:.1em;
  left: -5%;
  white-space:nowrap;
  display: block;
  transform: rotate(-15deg);
}
s.straight::before, strike.straight::before{transform:matrix()}


.p-carousel-items-content {
  overflow: hidden;
  width: 100%;
  padding: 12px;
}
.product-item {
  .product-item-content {
    border: 1px solid var(--surface-border);
    border-radius: 3px;
    margin: .3rem;
    text-align: center;
    padding: 2rem 0;
  }

  .product-image {
    width: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
  }
}
</style>
<script src="./index.js"/>
