---
title: RPN: Keep Source Units on by Default
---
# RPN: Keep Source Units on by Default

## What & Why
The "Keep source units" toggle in the RPN calculator currently defaults to off. Users expect it to be on by default, so source units are preserved immediately without needing to manually enable it each session.

## Done looks like
- When the RPN calculator is first opened (or after a reset), the "Keep source units" toggle is already enabled.
- Existing toggle behaviour is otherwise unchanged — users can still turn it off.

## Out of scope
- Any other calculator settings or defaults.

## Tasks
1. Change the initial value of `preserveSourceUnit` in the calculator reducer's default state from `false` to `true`.

## Relevant files
- `client/src/components/unit-converter/state/calculatorReducer.ts:16-30`