<template>
	<b-container fluid class="pl-0 pr-0">
		<b-tabs content-class="mt-3">
			<b-tab :title="index" v-for="(item, index) in data" :key="index" active>
				<b-card-group>
					<b-col class="pl-0 pr-0 ml-0 mr-0" sm="10">
						<b-card class="vw-100" :title="index">
							<b-card
								no-body
								class="mb-1"
								v-for="(item2, index2) in item"
								:key="index2"
							>
								<b-card-header header-tag="header" class="p-1" role="tab">
									<b-button
										block
										href="#"
										v-b-toggle="'accordion' + index + index2"
										variant="info"
										>{{ checktitle(index2) }}</b-button
									>
								</b-card-header>
								<b-collapse
									:id="'accordion' + index + index2"
									accordion="my-accordion"
									role="tabpanel"
								>
									<b-card-body>
										<b-card-group class="pl-0 pr-0">
											<b-card
												:title="'Rerolled: ' + items.rerolled"
												v-for="(items, iindex) in item2"
												:key="iindex"
											>
												<b-card-body>
													<b-list-group>
														<b-list-group-item
															class="d-flex justify-content-between align-items-center"
														>
															Average value of trades
															<b-badge variant="primary" pill>{{
																items.avg.toFixed(2)
															}}</b-badge>
														</b-list-group-item>

														<b-list-group-item
															class="d-flex justify-content-between align-items-center"
														>
															The average price variation
															<b-badge variant="primary" pill>{{
																items.stddev.toFixed(2)
															}}</b-badge>
														</b-list-group-item>

														<b-list-group-item
															class="d-flex justify-content-between align-items-center"
														>
															Lowest price for this riven
															<b-badge variant="primary" pill>{{
																items.min.toFixed(2)
															}}</b-badge>
														</b-list-group-item>
														<b-list-group-item
															class="d-flex justify-content-between align-items-center"
														>
															Highest price for this riven
															<b-badge variant="primary" pill>{{
																items.max.toFixed(2)
															}}</b-badge>
														</b-list-group-item>
														<b-list-group-item
															class="d-flex justify-content-between align-items-center"
														>
															Popularity of this Riven Type
															<b-badge variant="primary" pill
																>{{ items.pop.toFixed(4) }} %</b-badge
															>
														</b-list-group-item>
													</b-list-group>
												</b-card-body>
											</b-card>
										</b-card-group>
										<b-card-text
											>Raw Data{{ item2 }}<br />Platform:
											{{ platform }}</b-card-text
										>
									</b-card-body>
								</b-collapse>
							</b-card>
						</b-card></b-col
					>
				</b-card-group>
			</b-tab>
		</b-tabs>
	</b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import HubPanelWrap from '@/components/HubPanelWrap';

export default {
	name: 'rivendata',
	data() {
		return {
			url: '',
			data: {}
		};
	},
	computed: {
		...mapState({
			platform: 'platform'
		}),
		...mapGetters({
			platform: 'platform'
		})
	},
	watch: {
		platform: function(val) {
			this.url =
				'http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivens' +
				val.toUpperCase() +
				'.json';
			this.getdata();
		}
	},
	mounted() {
		this.url =
			'http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivens' +
			this.platform.toUpperCase() +
			'.json';
		this.getdata();
	},
	methods: {
		capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		},
		checktitle(title) {
			if (title == 'null') {
				return ' No compatibility returned';
			} else {
				return this.capitalizeFirstLetter(title);
			}
		},
		track() {
			this.$ga.page('/riven/data');
		},
		getdata() {
			this.axios.get(this.url).then((response) => {
				var data1 = this.lodash.mapValues(
					this.lodash.groupBy(response.data, 'itemType'),
					(clist) => clist.map((car) => this.lodash.omit(car, 'itemType'))
				);

				for (var key in data1) {
					data1[key] = this.lodash.mapValues(
						this.lodash.groupBy(data1[key], 'compatibility'),
						(clist2) =>
							clist2.map((car1) => this.lodash.omit(car1, 'compatibility'))
					);
				}
				this.data = data1;
			});
		}
	},
	components: {
		HubPanelWrap
	}
};
</script>
<style scoped>
.row {
	margin-right: 0px !important;
	margin-left: 0px !important;
}
</style>
