class Solution:
    def predictTheWinner(self, nums: List[int]) -> bool:
        memo = {}
        def dp(i, j):
            key = (i, j)
            if key in memo:
                return memo[key]
            if i == j:
                return nums[i]
            if i > j:
                return 0
            
            memo[key] = max(nums[i] - dp(i + 1, j), nums[j] - dp(i, j - 1))
            return memo[key]
        
        return dp(0, len(nums) - 1) >= 0
