#include<bits/stdc++.h>
#define int long long
using namespace std;
class Segment_Tree{
public:
	struct tree{
		int l,r,sum,maxx,minx,flag;
	}tr[800005];
	void pushup(int u){
		tr[u].sum=tr[u<<1].sum+tr[u<<1|1].sum;
		tr[u].maxx=max(tr[u<<1].maxx,tr[u<<1|1].maxx);
		tr[u].minx=min(tr[u<<1].minx,tr[u<<1|1].minx);
	}
	void pushdown(int u){
		if(tr[u].flag){
			tr[u<<1].sum+=tr[u].flag*(tr[u<<1].r-tr[u<<1].l+1),tr[u<<1].maxx+=tr[u].flag,tr[u<<1].minx+=tr[u].flag,tr[u<<1].flag+=tr[u].flag;
			tr[u<<1|1].sum+=tr[u].flag*(tr[u<<1|1].r-tr[u<<1|1].l+1),tr[u<<1|1].maxx+=tr[u].flag,tr[u<<1|1].minx+=tr[u].flag,tr[u<<1|1].flag+=tr[u].flag;
			tr[u].flag=0;
		}
	}
	void build(int u,int l,int r){
		if(l==r){
			tr[u]={l,r,0,0,0,0};
			return;
		}
		tr[u]={l,r};
		int mid=l+r>>1;
		build(u<<1,l,mid),build(u<<1|1,mid+1,r);
		pushup(u);
	}
	void change(int u,int l,int r,int k){
		if(l>r)return;
		if(tr[u].l>=l&&tr[u].r<=r){
			tr[u].sum+=k*(tr[u].r-tr[u].l+1);
			tr[u].maxx+=k,tr[u].minx+=k;
			tr[u].flag+=k;
			return;
		}
		pushdown(u);
		int mid=tr[u].l+tr[u].r>>1;
		if(l<=mid)change(u<<1,l,r,k);
		if(r>mid)change(u<<1|1,l,r,k);
		pushup(u);
	}
	int query_sum(int u,int l,int r){
		if(tr[u].l>=l&&tr[u].r<=r)return tr[u].sum;
		pushdown(u);
		int mid=tr[u].l+tr[u].r>>1,res=0;
		if(l<=mid)res+=query_sum(u<<1,l,r);
		if(r>mid)res+=query_sum(u<<1|1,l,r);
		return res;
	}
	int query_max(int u,int l,int r){
		if(tr[u].l>=l&&tr[u].r<=r)return tr[u].maxx;
		pushdown(u);
		int mid=tr[u].l+tr[u].r>>1,res=-1e18;
		if(l<=mid)res=max(res,query_max(u<<1,l,r));
		if(r>mid)res=max(res,query_max(u<<1|1,l,r));
		return res;
	}
	int query_min(int u,int l,int r){
		if(tr[u].l>=l&&tr[u].r<=r)return tr[u].minx;;
		pushdown(u);
		int mid=tr[u].l+tr[u].r>>1,res=1e18;
		if(l<=mid)res=min(res,query_min(u<<1,l,r));
		if(r>mid)res=min(res,query_min(u<<1|1,l,r));
		return res;
	}
}sgt;
int t,n,a,b;
signed main(){
    int t=4;
	while(t--){
        if(t==4){
          n=2;
          a=5;
          b=9;
        }
        else if(t==3){
            n=3;
            b=5;
            b=9;
        }
        else if(t==2){
            n=3;
            a=5;
            b=11;
        }
        else{
            n=4;
            a=5;
            b=11;
        }
		int ans=1e18;
		for(int i=0;i<=n;i++){
			if((n-i)&1)continue;
			ans=min(ans,i*a+(n-i)/2*b);
		}
		cout<<ans<<endl;
	}
}