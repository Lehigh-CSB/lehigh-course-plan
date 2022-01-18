<template>
  <div class="vue-drag-n-drop">
    <h2 class="dd-title">
      {{originalTitle}}
    </h2>
    <div class="dd-first-group">
        <button>
          Add Semester
        </button> <br>
        <button
          v-for="tab in tabs"
          v-bind:key="tab"
          v-bind:class="['tab-button', {active: currentTab === tab}]"
          v-on:click="currentTab = tab"
          >
          {{tab}}
        </button> 
        <Container 
          @drop="onDrop" 
          group-name="col"
          :orientation="'vertical'"
          :get-child-payload="getOriginalCardPayload()"
          drag-class="dd-card-ghost"
          drop-class="dd-card-ghost-drop">

          <Draggable v-for="(item, iind) in items" :key="iind">
            <template v-if="item.designation===currentTab">
              <slot name="dd-card" v-bind:cardData="item">
                <div v-if="!item.used" class="card">
                  <p>
                    {{item}}
                  </p>
                </div>
              </slot>
            </template>
          </Draggable>
        </Container>
    </div>
    <hr>
    <div class="dd-result-group">
      <div 
        v-for="(item,ind) in semesters"
        v-bind:key="ind"
        class = 'ddDropContainer'>
      <div v-bind:style=" item.season === 'fall' ? 'display: block;' : 'display: inline-block;'" > 
        <!--- https://stackoverflow.com/questions/48455909/condition-in-v-bindstyle --->
        {{item.name}}
        <Container 
          group-name="col"
          @drop="(e) => onCardDrop(item.name, e)"
          :get-child-payload="getCardPayload(item.name)"
          drag-class="dd-card-ghost"
          drop-class="dd-card-ghost-drop"
        >
          <Draggable v-for="(card, cid) in item.children" :key="cid">
            <slot name="dd-card" v-bind:cardData="card">
              <div class="card">
                <p>
                  {{card}}
                </p>
              </div>
            </slot>
          </Draggable>
        </Container>
        <h3 style="float:right;">Total Credits: {{item.totalCredits}}</h3>
      </div>
        <br v-if="item.season === 'fall'">
      </div>
    </div>

    <div class="dd-drop-actions" v-if="enableSave || enableCancel">
      <button class="button dd-save" v-if="enableSave" @click="saveClicked()">
        Save
      </button>
      <button class="button dd-cancel" v-if="enableCancel" @click="cancelClicked()">
        Cancel
      </button>
    </div>

  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import _ from 'lodash';
import RequiredProps from './drag-n-drop-props.js';
import Tab from './components/Tab.vue';

export default {
  name: "VueDragNDrop",
  components: { Container, Draggable, Tab},
  props: RequiredProps,

  data: function () {
    return {
      items:[],
      semesters: [],
      currentTab: 'CS',
      tabs: ['CS', 'BUS', 'MATH', 'NS'],
    }
  },

  computed: {
    currentTabComponent() {
      return 'tab-' + this.currentTab.toLowerCase();
    }
  },

  created() {
    if (this.inPlace) {
      this.items = this.originalData;
      this.semesters = this.dropzones;
    }
    else {
      this.items = _.cloneDeep(this.originalData);
      this.semesters = _.cloneDeep(this.dropzones);
    }
  },

  methods: {
    /** 
     * Even that runs when an item is dropped in the original list bucket.
     * @param {Object} dropResult Holds the value of what is dropped.
     * @public
    */
    onDrop(dropResult){
      this.items = this.applyDrag(this.items, dropResult);
      this.$emit('dropInOriginalBucket', dropResult);
    },

    /** 
     * Runs when the card is dropped in any of the drop buckets. Handles the dropping into new bucket and 
     * removing from original bucket.
     * @param {String} columnId Holds the ID of the original bucket tot get the card.
     * @param {Object} dropResult Holds the drop result.
    */
    onCardDrop(columnId, dropResult) {
      let removedIndex = dropResult.removedIndex;
      let addedIndex = dropResult.addedIndex;
      // console.log(removedIndex);
      // console.log(this.originalData);
      // console.log(dropResult.payload);
      if (removedIndex !== null || addedIndex !== null) {

        if(removedIndex !== null){
          let found = this.semesters.filter(p => p.name === columnId)[0];
          found.children.splice(removedIndex, 1);
        }

        if (addedIndex !== null){
          let found = this.semesters.filter(p => p.name === columnId)[0];
          found.children.splice(addedIndex, 0, dropResult.payload);
        }
      }
      this.$emit('dropInDestinationBucket', columnId, dropResult);
    },

    /** 
     * Gets the card payload
     * @param {String} Holds the ID.
    */
    getCardPayload(id){
      let that = this;
      return function(index) {
        let found = that.semesters.filter(p => p.name === id)[0].children[
          index
        ];

        return found;
      }
    },

    /** 
     * Same as card payload but this is only implemented in original list.
     * @public
    */
    getOriginalCardPayload(){
      let that = this;
      return function(index){
        return that.items[index];
      }
    },

    /** 
     * Applies the dragging result. It removes the item from original bucket and keeps it in new new list.
     * @param {Array} arr Holds the array.
     * @param {Object} dragResult Holds the drag information.
     * @returns the new corrected list.
     * @public
    */
    applyDrag(arr, dragResult) {
      let { removedIndex, addedIndex, payload } = dragResult
      removedIndex = removedIndex % arr.length;
      addedIndex = addedIndex % arr.length;
      // console.log(arr[removedIndex]);
      if (removedIndex === null && addedIndex === null) return arr

      const result = [...arr]
      let itemToAdd = payload

      // console.log(arr[removedIndex].used);

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }

      // arr[removedIndex].used = true;
      // console.log(result);
      // console.log(arr[removedIndex].used);

      return result;
    },

    /** 
     * Runs when save button is clicked. It first validates if all the items from the original list is empty.
     * @public
    */
    saveClicked() {
      /** 
       * @event save Emits when save is clicked so that the parent component can appropriately handle it.
       * @type {Object} 
      */
      this.$emit('save', {
        dropzones: this.semesters,
        originalBucket: this.items
      });
    },

    cancelClicked() {
      /** 
       * @event cancel Handles the cancellation.
      */
      this.$emit("cancel");
    }
  }
}
</script>

<style>

.ddDropContainer{
  vertical-align: top;
  width: 210px;
  padding: 10px;
  margin: 5px;
  min-height: 5em;
  margin-right: 10px;
  white-space: normal;
  background-color: #f3f3f3;
  box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24);
}

.newSemesterLine{
  display: block;
}

.sameSemesterLine{
  display: inline-block;
}

.card{
  margin: 5px;
  width: 200px;
  background-color: white;
  box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24);
  padding: 10px;
}

.used-card{
  margin: 5px;
  width: 200px;
  background-color: white;
  box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.24);
  padding: 10px;
  opacity: 0.5;
}

.dd-result-group {
  overflow: auto;
  white-space: nowrap;
}

.dd-first-group {
  overflow-y: auto;
  float: right;
  margin: 20px;
  max-height: 100%;
}

.dd-first-group > .smooth-dnd-container {
  min-height: 100px;
  white-space: unset;
}

.dd-drop-actions{
  text-align: center;
  margin: 10px 0px;
}

.dd-drop-actions button
{
  margin-right: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
}

.dd-save{
  background: #5cdb95 !important;
  border: none;
  cursor: pointer;
}

.dd-cancel {
  border: none;
  cursor: pointer;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}

</style>
